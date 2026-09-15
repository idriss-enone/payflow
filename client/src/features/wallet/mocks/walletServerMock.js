import storageUtil from "@/utils/storage.util";
import { STORAGE_KEYS } from "@/config/storage.config";
import { TX_KIND, TX_STATUS, WALLET_DELAY, WALLET_ERRORS, } from "../constants/wallet.constants";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const genId = (prefix) =>
    `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`.toUpperCase();
const sanitizePhone = (phone) => (phone || "").replace(/\D/g, "");

function getUsers() {
    return storageUtil.get(STORAGE_KEYS.MOCK_USERS_DB) || [];
}
function saveUsers(users) {
    storageUtil.set(STORAGE_KEYS.MOCK_USERS_DB, users);
}
function getAllTransactions() {
    return storageUtil.get(STORAGE_KEYS.GLOBAL_TRANSACTIONS) || [];
}
function saveAllTransactions(transactions) {
    storageUtil.set(STORAGE_KEYS.GLOBAL_TRANSACTIONS, transactions);
}

function transactionsForUser(userId) {
    return getAllTransactions()
        .filter((t) => t.userId === userId)
        .sort((a, b) => b.createdAt - a.createdAt);
}

function recordTransaction(entry) {
    const transactions = getAllTransactions();
    const tx = { id: genId("TX"), status: TX_STATUS.COMPLETED, createdAt: Date.now(), ...entry };
    transactions.push(tx);
    saveAllTransactions(transactions);
    return tx;
}

export function installWalletMock(mock) {

    mock.onGet("/wallet/summary").reply(async (config) => {
        await delay(WALLET_DELAY.READ);
        const { userId } = config.params || {};
        const user = getUsers().find((u) => u.id === userId);
        if (!user) return [404, { message: WALLET_ERRORS.GENERIC }];
        return [200, { balance: user.balance, transactions: transactionsForUser(userId).slice(0, 6) }];
    })

    mock.onGet("/wallet/transactions").reply(async (config) => {
        await delay(WALLET_DELAY.READ);
        const { userId } = config.params || {};
        return [200, { transactions: transactionsForUser(userId) }];
    });

    mock.onPost("/wallet/transfer").reply(async (config) => {
        await delay(WALLET_DELAY.TRANSFER);
        const { userId, recipientPhone, amount, note } = JSON.parse(config.data);
        const users = getUsers();
        const sender = users.find((u) => u.id === userId);
        const recipient = users.find((u) => sanitizePhone(u.phone) === sanitizePhone(recipientPhone));
        if (!sender) return [404, { message: WALLET_ERRORS.GENERIC }];
        if (!recipient) return [404, { message: WALLET_ERRORS.RECIPIENT_NOT_FOUND }];
        if (recipient.id === sender.id) return [422, { message: WALLET_ERRORS.SELF_TRANSFER }];
        if (amount > sender.balance) return [422, { message: WALLET_ERRORS.INSUFFICIENT_FUNDS }];


        sender.balance -= amount;
        recipient.balance += amount;
        saveUsers(users)

        const senderTx = recordTransaction({
            userId: sender.id,
            kind: TX_KIND.TRANSFER_OUT,
            amount: -amount,
            counterpartyName: recipient.name,
            note,
            status: TX_STATUS.SUCCESS,
        });

        recordTransaction({
            userId: recipient.id,
            kind: TX_KIND.TRANSFER_IN,
            amount,
            counterpartyName: sender.name,
            note,
            status: TX_STATUS.SUCCESS,
        });

        return [200, { balance: sender.balance, transaction: senderTx }];
    })

}