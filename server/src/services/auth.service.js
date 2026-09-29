import { randomUUID } from "node:crypto";
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

import { userRepository } from "../repositories/user.repository.js";
import { walletRepository } from "../repositories/wallet.repository.js";
import { refreshTokenRepository } from "../repositories/refreshToken.repository.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { hashToken } from "../utils/hash.js";
import { AppError } from "../utils/errors.js";
import { AUTH_ERRORS } from "../constants/messages.js";

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const toPublicUser = (user) => ({ id: user.id, name: user.name, phone: user.phone });

export const authService = {
  async registerUser({ name, phone, pin }) {
    const existingUser = await userRepository.existsByPhone(phone);
    if (existingUser) {
      throw AppError.from(AUTH_ERRORS.PHONE_EXISTS, 409);
    }

    const pinHash = await bcrypt.hash(pin, SALT_ROUNDS);
    const userId = randomUUID();
    const walletId = randomUUID();
    const refreshTokenId = randomUUID();

    const publicUser = { id: userId, name, phone };
    const accessToken = generateAccessToken(publicUser);
    const refreshToken = generateRefreshToken(publicUser, refreshTokenId);
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DURATION_MS);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await userRepository.createUser({ id: userId, name, phone, pinHash }, connection);
      await walletRepository.createWallet({ id: walletId, userId, balance: 0 }, connection);
      await refreshTokenRepository.createRefreshToken({ id: refreshTokenId, userId, tokenHash, expiresAt }, connection);
      await connection.commit();

      return { user: publicUser, accessToken, refreshToken };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async loginUser({ phone, pin }) {
    const user = await userRepository.findUserByPhone(phone);
    if (!user) throw AppError.from(AUTH_ERRORS.INVALID_CREDENTIALS, 401);

    const isPinValid = await bcrypt.compare(pin, user.pin_hash);
    if (!isPinValid) throw AppError.from(AUTH_ERRORS.INVALID_CREDENTIALS, 401);

    const publicUser = toPublicUser(user);
    const accessToken = generateAccessToken(publicUser);

    const refreshTokenId = randomUUID();
    const refreshToken = generateRefreshToken(publicUser, refreshTokenId);
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DURATION_MS);

    await refreshTokenRepository.createRefreshToken({ id: refreshTokenId, userId: user.id, tokenHash, expiresAt });

    return { user: publicUser, accessToken, refreshToken };
  },

  async refreshAccessToken(refreshToken) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw AppError.from(AUTH_ERRORS.REFRESH_TOKEN_INVALID, 401);
    }
    if (payload.type !== "refresh") throw AppError.from(AUTH_ERRORS.REFRESH_TOKEN_INVALID, 401);

    const storedToken = await refreshTokenRepository.findActiveRefreshToken(payload.jti);
    if (!storedToken) throw AppError.from(AUTH_ERRORS.REFRESH_TOKEN_REVOKED, 401);

    if (hashToken(refreshToken) !== storedToken.token_hash) {
      throw AppError.from(AUTH_ERRORS.REFRESH_TOKEN_INVALID, 401);
    }

    const user = await userRepository.findUserById(payload.sub);
    if (!user) throw AppError.from(AUTH_ERRORS.USER_NOT_FOUND, 401);

    const accessToken = generateAccessToken(toPublicUser(user));
    return { accessToken };
  },

  async logoutUser(refreshToken) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return;
    }
    if (payload.type !== "refresh") return;

    const storedToken = await refreshTokenRepository.findActiveRefreshToken(payload.jti);
    if (!storedToken) return;
    if (hashToken(refreshToken) !== storedToken.token_hash) return;

    await refreshTokenRepository.revokeRefreshToken(storedToken.id);
  },

  async getCurrentUser(userId) {
    const user = await userRepository.findUserById(userId);
    if (!user) throw AppError.from(AUTH_ERRORS.USER_NOT_FOUND, 404);
    return toPublicUser(user);
  },
};