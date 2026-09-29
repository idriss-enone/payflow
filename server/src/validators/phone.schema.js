import { z } from "zod";

// Partagé entre l'authentification (inscription/connexion) et le wallet
// (destinataire d'un transfert) — un seul endroit qui définit ce qu'est
// un numéro camerounais valide.
export const phoneSchema = z
  .string()
  .trim()
  .transform((val) => val.replace(/[\s.-]/g, ""))
  .refine((val) => {
    const localRegex = /^[26]\d{8}$/;
    const intlRegex = /^(?:\+237|00237)[26]\d{8}$/;
    return localRegex.test(val) || intlRegex.test(val);
  }, "Invalid Cameroon phone number (e.g., 670000001 or +237670000001).")
  .transform((val) => val.replace(/^(?:\+237|00237)/, ""));