import { pool } from "../config/db.js";

// Exécute plusieurs requêtes comme une seule unité atomique : si l'une
// échoue, toutes sont annulées. Utilisé partout où une opération touche
// plusieurs tables à la fois (ex. créer un utilisateur ET son wallet ET
// son premier refresh token, à l'inscription).
export const withTransaction = async (callback) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};