import { pool } from "../config/db.js";

export const billPaymentRepository = {
    async createBillPayment({ id, transactionId, billerName, customerReference }, connection = pool) {
        await connection.query(
            "INSERT INTO bill_payments (id, transaction_id, biller_name, customer_reference) VALUES (?, ?, ?, ?)",
            [id, transactionId, billerName, customerReference]
        );
        return { id, transactionId, billerName, customerReference };
    },

    async findByTransactionIds(transactionIds, connection = pool) {
        if (transactionIds.length === 0) return [];
        const [rows] = await connection.query(
            "SELECT transaction_id, biller_name, customer_reference FROM bill_payments WHERE transaction_id IN (?)",
            [transactionIds]
        );
        return rows;
    },
};