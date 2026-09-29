import { pool } from "../config/db.js";

export const withdrawalRepository = {
  async createWithdrawal({ id, transactionId, channelName }, connection = pool) {
    await connection.query(
      "INSERT INTO withdrawals (id, transaction_id, channel_name) VALUES (?, ?, ?)",
      [id, transactionId, channelName]
    );
    return { id, transactionId, channelName };
  },

  async findByTransactionIds(transactionIds, connection = pool) {
    if (transactionIds.length === 0) return [];
    const [rows] = await connection.query(
      "SELECT transaction_id, channel_name FROM withdrawals WHERE transaction_id IN (?)",
      [transactionIds]
    );
    return rows;
  },
};