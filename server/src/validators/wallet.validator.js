import { z } from "zod";
import { phoneSchema } from "./phone.schema.js";

export const transferSchema = z.object({
  recipientPhone: phoneSchema,
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  note: z.string().trim().max(255).optional(),
});

export const topUpSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  channelName: z.string().trim().min(2).max(60),
});

export const withdrawSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  channelName: z.string().trim().min(2, "Channel name is required").max(60),
});

export const billPaymentSchema = z.object({
  billerName: z.string().trim().min(2, "Biller name is required").max(120),
  reference: z.string().trim().min(2, "Reference is required").max(160),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
});