import { pool } from "../config/db.js";

export const transferRepository = {
  async createTransfer({ id, senderWalletId, receiverWalletId, amount, note }, connection = pool) {
    await connection.query(
      `INSERT INTO transfers (id, sender_wallet_id, receiver_wallet_id, amount, note)
       VALUES (?, ?, ?, ?, ?)`,
      [id, senderWalletId, receiverWalletId, amount, note ?? null]
    );
    return { id, senderWalletId, receiverWalletId, amount, note };
  },

  async findManyWithNamesByIds(transferIds, connection = pool) {
    if (transferIds.length === 0) return [];
    const [rows] = await connection.query(
      `SELECT tr.id, tr.sender_wallet_id, tr.receiver_wallet_id,
              su.name AS sender_name, ru.name AS receiver_name
       FROM transfers tr
       JOIN wallets sw ON sw.id = tr.sender_wallet_id JOIN users su ON su.id = sw.user_id
       JOIN wallets rw ON rw.id = tr.receiver_wallet_id JOIN users ru ON ru.id = rw.user_id
       WHERE tr.id IN (?)`,
      [transferIds]
    );
    return rows;
  },
};