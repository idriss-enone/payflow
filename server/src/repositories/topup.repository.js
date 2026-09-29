import { pool } from "../config/db.js";

export const topupRepository = {
  async createTopup({ id, transactionId, channelName }, connection = pool) {
    await connection.query(
      "INSERT INTO topups (id, transaction_id, channel_name) VALUES (?, ?, ?)",
      [id, transactionId, channelName]
    );
    return { id, transactionId, channelName };
  },

  async findByTransactionIds(transactionIds, connection = pool) {
    if (transactionIds.length === 0) return [];
    const [rows] = await connection.query(
      "SELECT transaction_id, channel_name FROM topups WHERE transaction_id IN (?)",
      [transactionIds]
    );
    return rows;
  },
};