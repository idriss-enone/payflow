import { pool } from "../config/db.js";

export const transactionRepository = {
  async createTransaction({ id, walletId, transferId = null, kind, direction, amount, reference }, connection = pool) {
    await connection.query(
      `INSERT INTO transactions (id, wallet_id, transfer_id, kind, direction, amount, reference)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, walletId, transferId, kind, direction, amount, reference]
    );
    return { id, walletId, transferId, kind, direction, amount, reference };
  },

  async findByWalletId(walletId, connection = pool) {
    const [rows] = await connection.query(
      `SELECT id, wallet_id, transfer_id, kind, direction, status, amount, reference, created_at
       FROM transactions WHERE wallet_id = ? ORDER BY created_at DESC`,
      [walletId]
    );
    return rows;
  },
};