import { walletService } from "../services/wallet.service.js";
import { transferSchema, topUpSchema, withdrawSchema, billPaymentSchema } from "../validators/wallet.validator.js";

function getIdempotencyKey(req) {
  return req.headers["idempotency-key"] || undefined;
}

export const getSummary = async (req, res) => {
  const result = await walletService.getSummary(req.user.id);
  res.status(200).json(result);
};

export const getBalance = async (req, res) => {
  const result = await walletService.getBalance(req.user.id);
  res.status(200).json(result);
};

export const getTransactions = async (req, res) => {
  const transactions = await walletService.getTransactions(req.user.id);
  res.status(200).json({ transactions });
};

export const transfer = async (req, res) => {
  const data = transferSchema.parse(req.body);
  const result = await walletService.sendMoney({
    senderUserId: req.user.id,
    receiverPhone: data.recipientPhone,
    amount: data.amount,
    note: data.note,
    idempotencyKey: getIdempotencyKey(req),
  });
  res.status(200).json(result);
};

export const topUp = async (req, res) => {
  const data = topUpSchema.parse(req.body);
  const result = await walletService.topUp(req.user.id, { ...data, idempotencyKey: getIdempotencyKey(req) });
  res.status(200).json(result);
};

export const withdraw = async (req, res) => {
  const data = withdrawSchema.parse(req.body);
  const result = await walletService.withdraw(req.user.id, { ...data, idempotencyKey: getIdempotencyKey(req) });
  res.status(200).json(result);
};

export const payBill = async (req, res) => {
  const data = billPaymentSchema.parse(req.body);
  const result = await walletService.payBill(req.user.id, { ...data, idempotencyKey: getIdempotencyKey(req) });
  res.status(200).json(result);
};