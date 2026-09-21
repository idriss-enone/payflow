import { pool } from "../config/db.js";

export const walletRepository = {
    async createWallet({ id, userId, balance = 0 }, connection = pool) {
        await connection.query(
            "INSERT INTO wallets (id, user_id, balance) VALUES (?, ?, ?)",
            [id, userId, balance]
        );
        return { id, userId, balance };
    },
};