import { z } from "zod";
import { phoneSchema } from "./phone.schema.js";

const pinSchema = z.string().regex(/^\d{4}$/, "PIN must contain exactly 4 digits");

const nameSchema = z.string()
  .trim()
  .min(2, "Name must contain at least 2 characters")
  .max(120, "Name must not exceed 120 characters");

export const registerSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  pin: pinSchema,
});

export const loginSchema = z.object({
  phone: phoneSchema,
  pin: pinSchema,
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});