import { randomUUID } from "node:crypto";
import { pool } from "../config/db.js";

export const userRepository = {
    //findUserByPhone
    async findByPhone(phone) {
        const [rows] = await pool.query(
            `SELECT u.id, u.name, u.phone, u.pin_hash, w.balance
            FROM users u
            JOIN wallets w ON w.user_id = u.id
            WHERE u.phone = ?`,
            [phone]
        );
        return rows[0] || null;
    },

    async findById(id) {
        const [rows] = await pool.query(
            `SELECT u.id, u.name, u.phone, w.balance
            FROM users u
            JOIN wallets w ON w.user_id = u.id
            WHERE u.id = ?`,
            [id]
        );
        return rows[0] || null;
    },

    async existsByPhone(phone) {
        const [rows] = await pool.query("SELECT id FROM users WHERE phone = ?", [phone]);
        return rows.length > 0;
    },


    async create({ name, phone, pinHash }) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const userId = randomUUID();
            await connection.query(
                "INSERT INTO users (id, name, phone, pin_hash) VALUES (?, ?, ?, ?)",
                [userId, name, phone, pinHash]
            );

            const walletId = randomUUID();
            await connection.query(
                "INSERT INTO wallets (id, user_id, balance) VALUES (?, ?, 0)",
                [walletId, userId]
            );
            await connection.commit();
            return { id: userId, name, phone, balance: 0 };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

