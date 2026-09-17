import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";
import { pool } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());



app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    await pool.query("SELECT 1");
    console.log("MySQL connection OK");
  } catch (err) {
    console.error("MySQL connection FAILED:", err.message);
  }
  console.log(`PayFlow API listening on http://localhost:${PORT}`);
});