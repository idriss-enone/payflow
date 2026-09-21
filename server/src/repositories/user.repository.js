import { pool } from "../config/db.js";

export const userRepository = {
    async findUserByPhone(phone) {
        const [rows] = await pool.query(
            "SELECT id, name, phone, pin_hash, created_at FROM users WHERE phone = ? LIMIT 1",
            [phone]
        );
        return rows[0] ?? null;
    },

    async findUserById(id) {
        const [rows] = await pool.query(
            "SELECT id, name, phone, created_at FROM users WHERE id = ? LIMIT 1",
            [id]
        );
        return rows[0] ?? null;
    },

    // connection = pool par défaut : appelable seul (hors transaction) ou
    // avec la connexion d'une transaction en cours (voir registerUser).
    async createUser({ id, name, phone, pinHash }, connection = pool) {
        await connection.query(
            "INSERT INTO users (id, name, phone, pin_hash) VALUES (?, ?, ?, ?)",
            [id, name, phone, pinHash]
        );
        return { id, name, phone };
    },
};