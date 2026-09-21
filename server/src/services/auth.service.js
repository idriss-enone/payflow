import crypto from "node:crypto";
import bcrypt from "bcrypt";

import { userRepository } from "../repositories/user.repository.js";
import { walletRepository } from "../repositories/wallet.repository.js";
import { refreshTokenRepository } from "../repositories/refreshToken.repository.js";
import { withTransaction } from "../utils/withTransaction.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { hashToken } from "../utils/hash.js";
import { AppError } from "../utils/errors.js";

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// Ne renvoie jamais pin_hash au reste de l'application — c'est ici, un
// seul endroit, que la frontière entre "donnée brute de la table" et
// "donnée sûre à exposer" est tracée.
const toPublicUser = (user) => ({ id: user.id, name: user.name, phone: user.phone });

export const authService = {
    async registerUser({ name, phone, pin }) {
        const existingUser = await userRepository.findUserByPhone(phone);
        if (existingUser) {
            throw new AppError("Phone number already registered", 409);
        }

        const pinHash = await bcrypt.hash(pin, SALT_ROUNDS);
        const userId = crypto.randomUUID();
        const walletId = crypto.randomUUID();
        const refreshTokenId = crypto.randomUUID();

        const publicUser = { id: userId, name, phone };
        const accessToken = generateAccessToken(publicUser);
        const refreshToken = generateRefreshToken(publicUser, refreshTokenId);
        const tokenHash = hashToken(refreshToken);
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DURATION_MS);

        // Les trois insertions (user, wallet, refresh token) réussissent ou
        // échouent ensemble — jamais un compte sans portefeuille.
        await withTransaction(async (connection) => {
            await userRepository.createUser({ id: userId, name, phone, pinHash }, connection);
            await walletRepository.createWallet({ id: walletId, userId, balance: 0 }, connection);
            await refreshTokenRepository.createRefreshToken(
                { id: refreshTokenId, userId, tokenHash, expiresAt },
                connection
            );
        });

        return { user: publicUser, accessToken, refreshToken };
    },

    async loginUser({ phone, pin }) {
        const user = await userRepository.findUserByPhone(phone);
        if (!user) throw new AppError("Invalid phone or PIN", 401);

        const isPinValid = await bcrypt.compare(pin, user.pin_hash);
        if (!isPinValid) throw new AppError("Invalid phone or PIN", 401);

        const publicUser = toPublicUser(user);
        const accessToken = generateAccessToken(publicUser);

        const refreshTokenId = crypto.randomUUID();
        const refreshToken = generateRefreshToken(publicUser, refreshTokenId);
        const tokenHash = hashToken(refreshToken);
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DURATION_MS);

        await refreshTokenRepository.createRefreshToken({
            id: refreshTokenId,
            userId: user.id,
            tokenHash,
            expiresAt,
        });

        return { user: publicUser, accessToken, refreshToken };
    },

    async refreshAccessToken(refreshToken) {
        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch {
            throw new AppError("Invalid or expired refresh token", 401);
        }
        if (payload.type !== "refresh") throw new AppError("Invalid refresh token", 401);

        const storedToken = await refreshTokenRepository.findActiveRefreshToken(payload.jti);
        if (!storedToken) throw new AppError("Refresh token revoked or expired", 401);

        // Comparaison du hash, pas du token brut : storedToken.token_hash est
        // ce qui est réellement en base, jamais le token lui-même.
        if (hashToken(refreshToken) !== storedToken.token_hash) {
            throw new AppError("Invalid refresh token", 401);
        }

        const user = await userRepository.findUserById(payload.sub);
        if (!user) throw new AppError("User not found", 401);

        const accessToken = generateAccessToken(toPublicUser(user));
        return { accessToken };
    },

    async logoutUser(refreshToken) {
        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch {
            return; // Token déjà invalide : rien à révoquer, pas une erreur.
        }
        if (payload.type !== "refresh") return;

        const storedToken = await refreshTokenRepository.findActiveRefreshToken(payload.jti);
        if (!storedToken) return;
        if (hashToken(refreshToken) !== storedToken.token_hash) return;

        await refreshTokenRepository.revokeRefreshToken(storedToken.id);
    },

    async getCurrentUser(userId) {
        const user = await userRepository.findUserById(userId);
        if (!user) throw new AppError("User not found", 404);
        return toPublicUser(user);
    },
};