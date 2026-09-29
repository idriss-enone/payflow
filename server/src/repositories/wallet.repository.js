import { pool } from "../config/db.js";

export const walletRepository = {
  async createWallet({ id, userId, balance = 0 }, connection = pool) {
    await connection.query("INSERT INTO wallets (id, user_id, balance) VALUES (?, ?, ?)", [id, userId, balance]);
    return { id, userId, balance };
  },

  async findByUserId(userId, connection = pool) {
    const [rows] = await connection.query(
      "SELECT id, user_id, balance, created_at, updated_at FROM wallets WHERE user_id = ? LIMIT 1",
      [userId]
    );
    return rows[0] ?? null;
  },

  async findWalletByUserIdForUpdate(userId, connection) {
    const [rows] = await connection.query(
      "SELECT id, user_id, balance FROM wallets WHERE user_id = ? LIMIT 1 FOR UPDATE",
      [userId]
    );
    return rows[0] ?? null;
  },

  // Verrouille plusieurs portefeuilles en une requête, triés par id —
  // ordre fixe qui évite l'interblocage entre deux transferts simultanés
  // dans des sens opposés.
  async findManyByUserIdsForUpdate(userIds, connection) {
    const [rows] = await connection.query(
      "SELECT id, user_id, balance FROM wallets WHERE user_id IN (?) ORDER BY id FOR UPDATE",
      [userIds]
    );
    return rows;
  },

  async updateWalletBalance(walletId, balance, connection) {
    await connection.query("UPDATE wallets SET balance = ? WHERE id = ?", [balance, walletId]);
  },
};