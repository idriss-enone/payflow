import { z } from "zod";

const phoneSchema = z
    .string({ required_error: "Le numéro de téléphone est requis." })
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length >= 9, "Le numéro de téléphone doit contenir au moins 9 chiffres.");

const pinSchema = z
    .string({ required_error: "Le code PIN est requis." })
    .regex(/^\d{4}$/, "Le code PIN doit contenir exactement 4 chiffres.");

const nameSchema = z
    .string({ required_error: "Le nom est requis." })
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères."),

export const registerSchema = z.object({
    name: nameSchema,
    phone: phoneSchema,
    pin: pinSchema,
});

export const loginSchema = z.object({
    phone: phoneSchema,
    pin: pinSchema,
});