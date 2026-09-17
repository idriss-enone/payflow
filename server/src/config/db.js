import mysql from "mysql2/promise";

// Un pool plutôt qu'une connexion unique : chaque requête emprunte une
// connexion libre du pool et la rend ensuite, au lieu de saturer une seule
// connexion partagée par toutes les requêtes simultanées.
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});