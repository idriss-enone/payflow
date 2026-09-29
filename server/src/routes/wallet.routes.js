import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSummary, getBalance, getTransactions, transfer, topUp, withdraw, payBill } from "../controllers/wallet.controller.js";

const router = Router();

router.use(authenticate);
router.get("/summary", asyncHandler(getSummary))
router.get("/balance", asyncHandler(getBalance));
router.get("/transactions", asyncHandler(getTransactions));
router.post("/topup", asyncHandler(topUp));
router.post("/withdrawal", asyncHandler(withdraw));
router.post("/bill-payment", asyncHandler(payBill));
router.post("/transfer", asyncHandler(transfer));

export default router;