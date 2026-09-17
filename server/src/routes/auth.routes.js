import { Router } from "express";
import { login, register, logout, getMe } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";


const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

export default router;