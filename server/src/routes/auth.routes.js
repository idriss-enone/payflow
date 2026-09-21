import { Router } from "express";

import { register, login, refresh, logout, getMe } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", asyncHandler(logout));
router.get("/me", authenticate, asyncHandler(getMe));

export default router;