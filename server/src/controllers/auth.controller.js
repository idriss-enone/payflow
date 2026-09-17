import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";

const PIN_SALT_ROUNDS = 10;

function sanitizePhone(phone) {
  return (phone || "").replace(/\D/g, "");
}

function issueTokens(userId) {
  const accessToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
  // Pas de vraie gestion de refresh token pour l'instant (pas de table
  // dédiée) — un token simple, à revoir si on ajoute la rotation plus tard.
  const refreshToken = jwt.sign({ sub: userId, type: "refresh" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return { accessToken, refreshToken };
}

export async function register(req, res, next) {
  try {
    const { name, phone, pin } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "auth.validation_name_short" });
    }
    const sanitizedPhone = sanitizePhone(phone);
    if (sanitizedPhone.length < 9) {
      return res.status(400).json({ message: "auth.validation_phone_short" });
    }
    if (!/^\d{4}$/.test(pin || "")) {
      return res.status(400).json({ message: "auth.validation_pin_format" });
    }

    const alreadyExists = await userRepository.existsByPhone(sanitizedPhone);
    if (alreadyExists) {
      return res.status(409).json({ message: "auth.error_phone_exists" });
    }

    const pinHash = await bcrypt.hash(pin, PIN_SALT_ROUNDS);
    const user = await userRepository.create({ name: name.trim(), phone: sanitizedPhone, pinHash });

    const { accessToken, refreshToken } = issueTokens(user.id);
    res.status(201).json({ user, accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { phone, pin } = req.body;
    const sanitizedPhone = sanitizePhone(phone);

    const user = await userRepository.findByPhone(sanitizedPhone);
    if (!user) {
      return res.status(401).json({ message: "auth.error_invalid_credentials" });
    }

    const pinMatches = await bcrypt.compare(pin || "", user.pin_hash);
    if (!pinMatches) {
      return res.status(401).json({ message: "auth.error_invalid_credentials" });
    }

    const { accessToken, refreshToken } = issueTokens(user.id);
    res.status(200).json({
      user: { id: user.id, name: user.name, phone: user.phone, balance: user.balance },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}


export async function logout(req, res) {
  res.status(204).send();
}

export async function getMe(req, res, next) {
  try {
    const user = await userRepository.findById(req.userId);
    if (!user) return res.status(404).json({ message: "common.error_generic" });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}