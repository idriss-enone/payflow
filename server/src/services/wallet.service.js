import { randomUUID } from "node:crypto";
import { pool } from "../config/db.js";
import { userRepository } from "../repositories/user.repository.js";
import { walletRepository } from "../repositories/wallet.repository.js";
import { transactionRepository } from "../repositories/transaction.repository.js";
import { topupRepository } from "../repositories/topup.repository.js";
import { withdrawalRepository } from "../repositories/withdrawal.repository.js";
import { billPaymentRepository } from "../repositories/billPayment.repository.js";
import { transferRepository } from "../repositories/transfer.repository.js";
import { idempotencyRepository } from "../repositories/idempotency.repository.js";
import { AppError } from "../utils/errors.js";
import { WALLET_ERRORS } from "../constants/messages.js";
import { TX_KIND, TX_DIRECTION, TX_STATUS } from "../constants/transaction.constants.js";


function newReference() {
  return `PF-TXN-${randomUUID()}`;
}

async function getWalletOrThrow(userId) {
  const wallet = await walletRepository.findByUserId(userId);
  if (!wallet) throw AppError.from(WALLET_ERRORS.WALLET_NOT_FOUND, 404);
  return wallet;
}


async function buildTransactionHistory(walletId) {
  const transactions = await transactionRepository.findByWalletId(walletId);

  const topupIds = [];
  const withdrawalIds = [];
  const billIds = [];
  const transferIds = [];
  for (const t of transactions) {
    if (t.kind === TX_KIND.TOP_UP) topupIds.push(t.id);
    else if (t.kind === TX_KIND.WITHDRAWAL) withdrawalIds.push(t.id);
    else if (t.kind === TX_KIND.BILL_PAYMENT) billIds.push(t.id);
    else if (t.kind === TX_KIND.TRANSFER && t.transfer_id) transferIds.push(t.transfer_id);
  }

  const [topups, withdrawals, billPayments, transfers] = await Promise.all([
    topupRepository.findByTransactionIds(topupIds),
    withdrawalRepository.findByTransactionIds(withdrawalIds),
    billPaymentRepository.findByTransactionIds(billIds),
    transferRepository.findManyWithNamesByIds([...new Set(transferIds)]),
  ]);

  const channelByTxId = new Map();
  for (const t of topups) channelByTxId.set(t.transaction_id, t.channel_name);
  for (const w of withdrawals) channelByTxId.set(w.transaction_id, w.channel_name);

  const billByTxId = new Map();
  for (const b of billPayments) {
    billByTxId.set(b.transaction_id, { billerName: b.biller_name, customerReference: b.customer_reference });
  }

  const transferById = new Map(transfers.map((t) => [t.id, t]));

  return transactions.map((row) => {
    let channelName = channelByTxId.get(row.id);
    let customerReference;
    let counterpartyName;

    if (row.kind === TX_KIND.BILL_PAYMENT) {
      const detail = billByTxId.get(row.id);
      channelName = detail?.billerName;
      customerReference = detail?.customerReference;
    }

    if (row.kind === TX_KIND.TRANSFER && row.transfer_id) {
      const transfer = transferById.get(row.transfer_id);
      if (transfer) {
        counterpartyName = row.wallet_id === transfer.sender_wallet_id ? transfer.receiver_name : transfer.sender_name;
      }
    }

    return {
      id: row.id,
      kind: row.kind,
      direction: row.direction,
      status: row.status,
      amount: row.direction === TX_DIRECTION.CREDIT ? Number(row.amount) : -Number(row.amount),
      channelName,
      customerReference,
      counterpartyName,
      reference: row.reference,
      createdAt: new Date(row.created_at).getTime(),
    };
  });
}

export const walletService = {
  async getBalance(userId) {
    const wallet = await getWalletOrThrow(userId);
    return { balance: Number(wallet.balance) };
  },

  async getTransactions(userId) {
    const wallet = await getWalletOrThrow(userId);
    return buildTransactionHistory(wallet.id);
  },

  // Un seul aller-retour pour le solde ET l'historique — utilisé par la
  // route /wallet/summary que le client appelle au chargement du dashboard.
  async getSummary(userId) {
    const wallet = await getWalletOrThrow(userId);
    const transactions = await buildTransactionHistory(wallet.id);
    return { balance: Number(wallet.balance), transactions };
  },

  async sendMoney({ senderUserId, receiverPhone, amount, note, idempotencyKey }) {
    if (!idempotencyKey) {
      throw AppError.from(WALLET_ERRORS.IDEMPOTENCY_KEY_REQUIRED, 400);
    }

    const existing = await idempotencyRepository.findByUserAndKey(senderUserId, idempotencyKey);
    if (existing) return existing.response_body;

    const receiver = await userRepository.findUserWithWalletByPhone(receiverPhone);
    if (!receiver) throw AppError.from(WALLET_ERRORS.RECEIVER_NOT_FOUND, 404);
    if (receiver.user_id === senderUserId) {
      throw AppError.from(WALLET_ERRORS.SELF_TRANSFER, 400);
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const wallets = await walletRepository.findManyByUserIdsForUpdate([senderUserId, receiver.user_id], connection);
      const senderWallet = wallets.find((w) => w.user_id === senderUserId);
      const receiverWallet = wallets.find((w) => w.user_id === receiver.user_id);
      if (!senderWallet) throw AppError.from(WALLET_ERRORS.WALLET_NOT_FOUND, 404);
      if (!receiverWallet) throw AppError.from(WALLET_ERRORS.WALLET_NOT_FOUND, 404);
      if (Number(senderWallet.balance) < Number(amount)) {
        throw AppError.from(WALLET_ERRORS.INSUFFICIENT_FUNDS, 400);
      }

      const senderNewBalance = Number(senderWallet.balance) - Number(amount);
      const receiverNewBalance = Number(receiverWallet.balance) + Number(amount);

      const transferId = randomUUID();
      await transferRepository.createTransfer(
        { id: transferId, senderWalletId: senderWallet.id, receiverWalletId: receiverWallet.id, amount, note },
        connection
      );

      await walletRepository.updateWalletBalance(senderWallet.id, senderNewBalance, connection);
      await walletRepository.updateWalletBalance(receiverWallet.id, receiverNewBalance, connection);

      const debitTxId = randomUUID();
      await transactionRepository.createTransaction(
        { id: debitTxId, walletId: senderWallet.id, transferId, kind: TX_KIND.TRANSFER, direction: TX_DIRECTION.DEBIT, amount, reference: newReference() },
        connection
      );
      await transactionRepository.createTransaction(
        { id: randomUUID(), walletId: receiverWallet.id, transferId, kind: TX_KIND.TRANSFER, direction: TX_DIRECTION.CREDIT, amount, reference: newReference() },
        connection
      );

      const result = {
        balance: senderNewBalance,
        transaction: {
          id: debitTxId,
          kind: TX_KIND.TRANSFER,
          direction: TX_DIRECTION.DEBIT,
          status: TX_STATUS.SUCCESS,
          amount: -amount,
          counterpartyName: receiver.name,
          note: note ?? undefined,
          createdAt: Date.now(),
        },
      };

      await idempotencyRepository.create(
        { id: randomUUID(), userId: senderUserId, idempotencyKey, endpoint: "transfer", responseBody: result },
        connection
      );

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async topUp(userId, { amount, channelName, idempotencyKey }) {
    if (idempotencyKey) {
      const existing = await idempotencyRepository.findByUserAndKey(userId, idempotencyKey);
      if (existing) return existing.response_body;
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const wallet = await walletRepository.findWalletByUserIdForUpdate(userId, connection);
      if (!wallet) throw AppError.from(WALLET_ERRORS.WALLET_NOT_FOUND, 404);

      const newBalance = Number(wallet.balance) + Number(amount);
      await walletRepository.updateWalletBalance(wallet.id, newBalance, connection);

      const txId = randomUUID();
      await transactionRepository.createTransaction(
        { id: txId, walletId: wallet.id, kind: TX_KIND.TOP_UP, direction: TX_DIRECTION.CREDIT, amount, reference: newReference() },
        connection
      );
      await topupRepository.createTopup({ id: randomUUID(), transactionId: txId, channelName }, connection);

      const result = {
        balance: newBalance,
        transaction: { id: txId, kind: TX_KIND.TOP_UP, direction: TX_DIRECTION.CREDIT, status: TX_STATUS.SUCCESS, amount, channelName, createdAt: Date.now() },
      };

      if (idempotencyKey) {
        await idempotencyRepository.create({ id: randomUUID(), userId, idempotencyKey, endpoint: "topup", responseBody: result }, connection);
      }

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async withdraw(userId, { amount, channelName, idempotencyKey }) {
    if (idempotencyKey) {
      const existing = await idempotencyRepository.findByUserAndKey(userId, idempotencyKey);
      if (existing) return existing.response_body;
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const wallet = await walletRepository.findWalletByUserIdForUpdate(userId, connection);
      if (!wallet) throw AppError.from(WALLET_ERRORS.WALLET_NOT_FOUND, 404);
      if (Number(amount) > Number(wallet.balance)) {
        throw AppError.from(WALLET_ERRORS.INSUFFICIENT_FUNDS, 400);
      }

      const newBalance = Number(wallet.balance) - Number(amount);
      await walletRepository.updateWalletBalance(wallet.id, newBalance, connection);

      const txId = randomUUID();
      await transactionRepository.createTransaction(
        { id: txId, walletId: wallet.id, kind: TX_KIND.WITHDRAWAL, direction: TX_DIRECTION.DEBIT, amount, reference: newReference() },
        connection
      );
      await withdrawalRepository.createWithdrawal({ id: randomUUID(), transactionId: txId, channelName }, connection);

      const result = {
        balance: newBalance,
        transaction: { id: txId, kind: TX_KIND.WITHDRAWAL, direction: TX_DIRECTION.DEBIT, status: TX_STATUS.SUCCESS, amount: -amount, channelName, createdAt: Date.now() },
      };

      if (idempotencyKey) {
        await idempotencyRepository.create({ id: randomUUID(), userId, idempotencyKey, endpoint: "withdrawal", responseBody: result }, connection);
      }

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async payBill(userId, { billerName, reference, amount, idempotencyKey }) {
    if (idempotencyKey) {
      const existing = await idempotencyRepository.findByUserAndKey(userId, idempotencyKey);
      if (existing) return existing.response_body;
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const wallet = await walletRepository.findWalletByUserIdForUpdate(userId, connection);
      if (!wallet) throw AppError.from(WALLET_ERRORS.WALLET_NOT_FOUND, 404);
      if (Number(amount) > Number(wallet.balance)) {
        throw AppError.from(WALLET_ERRORS.INSUFFICIENT_FUNDS, 400);
      }

      const newBalance = Number(wallet.balance) - Number(amount);
      await walletRepository.updateWalletBalance(wallet.id, newBalance, connection);

      const txId = randomUUID();
      await transactionRepository.createTransaction(
        { id: txId, walletId: wallet.id, kind: TX_KIND.BILL_PAYMENT, direction: TX_DIRECTION.DEBIT, amount, reference: newReference() },
        connection
      );
      await billPaymentRepository.createBillPayment({ id: randomUUID(), transactionId: txId, billerName, customerReference: reference }, connection);

      const result = {
        balance: newBalance,
        transaction: { id: txId, kind: TX_KIND.BILL_PAYMENT, direction: TX_DIRECTION.DEBIT, status: TX_STATUS.SUCCESS, amount: -amount, channelName: billerName, customerReference: reference, createdAt: Date.now() },
      };

      if (idempotencyKey) {
        await idempotencyRepository.create({ id: randomUUID(), userId, idempotencyKey, endpoint: "bill-payment", responseBody: result }, connection);
      }

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};