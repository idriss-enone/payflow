import { z } from "zod";

// Schéma de téléphone STRICTEMENT Camerounais
const phoneSchema = z
  .string()
  .trim()
  .transform((val) => val.replace(/[\s.-]/g, ""))
  .refine(
    (val) => {
      const localRegex = /^[26]\d{8}$/;
      const intlRegex = /^(?:\+237|00237)[26]\d{8}$/;
      return localRegex.test(val) || intlRegex.test(val);
    },
    { message: "Invalid Cameroon phone number (e.g., 670000001 or +237670000001)." }
  )
  .transform((val) => val.replace(/^(?:\+237|00237)/, ""));

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