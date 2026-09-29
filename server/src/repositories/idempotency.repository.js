import { pool } from "../config/db.js";

export const idempotencyRepository = {
  async findByUserAndKey(userId, idempotencyKey, connection = pool) {
    const [rows] = await connection.query(
      "SELECT id, response_body FROM idempotency_keys WHERE user_id = ? AND idempotency_key = ? LIMIT 1",
      [userId, idempotencyKey]
    );
    return rows[0] ?? null;
  },

  async create({ id, userId, idempotencyKey, endpoint, responseBody }, connection = pool) {
    await connection.query(
      "INSERT INTO idempotency_keys (id, user_id, idempotency_key, endpoint, response_body) VALUES (?, ?, ?, ?, ?)",
      [id, userId, idempotencyKey, endpoint, JSON.stringify(responseBody)]
    );
  },
};