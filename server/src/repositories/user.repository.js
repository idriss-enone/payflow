import { pool } from "../config/db.js";

export const userRepository = {
    async findUserByPhone(phone, connection = pool) {
        const [rows] = await connection.query(
            `
            SELECT u.id, u.name, u.phone, u.pin_hash, w.balance
            FROM users u
            INNER JOIN wallets w ON w.user_id = u.id
            WHERE u.phone = ?
            LIMIT 1
            `,
            [phone]
        );
        return rows[0] ?? null;
    },
    async existsByPhone(phone, connection = pool) {
        const [rows] = await connection.query("SELECT id FROM users WHERE phone = ? LIMIT 1", [phone]);
        return rows.length > 0;
    },

    async findUserById(id, connection = pool) {
        const [rows] = await connection.query("SELECT id, name, phone FROM users WHERE id = ? LIMIT 1", [id]);
        return rows[0] ?? null;
    },
    async createUser({ id, name, phone, pinHash }, connection = pool) {

        await connection.query(`INSERT INTO users (id,name,phone,pin_hash) VALUES (?, ?, ?, ?)`,
            [id, name, phone, pinHash]
        );
        return { id, name, phone };
    },
    async findUserWithWalletByPhone(phone, connection = pool) {
        const [rows] = await connection.query(
            `
      SELECT
        u.id AS user_id,
        u.name,
        u.phone,
        w.id AS wallet_id,
        w.balance
      FROM users u
      INNER JOIN wallets w
        ON w.user_id = u.id
      WHERE u.phone = ?
      LIMIT 1
    `,
            [phone]
        );

        return rows[0] ?? null;
    },


};