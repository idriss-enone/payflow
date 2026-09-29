import { pool } from "../config/db.js";

export const refreshTokenRepository = {
    async createRefreshToken({ id, userId, tokenHash, expiresAt }, connection = pool) {
        await connection.query(
            "INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)",
            [id, userId, tokenHash, expiresAt]
        );
    },

    async findActiveRefreshToken(id) {
        const [rows] = await pool.query(
            `
            SELECT id, user_id, token_hash, expires_at, revoked_at
            FROM refresh_tokens
            WHERE id = ? 
                AND revoked_at IS NULL 
                AND expires_at > NOW()
            LIMIT 1`,
            [id]
        );
        return rows[0] ?? null;
    },

    async revokeRefreshToken(id) {
        await pool.query("UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = ?", [id]);
    },
};