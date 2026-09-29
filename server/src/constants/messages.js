// Messages destinés à l'API elle-même — lisibles indépendamment de tout
// client (curl, Postman, un futur client mobile). Chaque service importe
// UNIQUEMENT depuis ce fichier ; plus aucune chaîne d'erreur en dur dans
// un service ou un middleware.
//
// "code" est ce que les clients utilisent pour choisir leur propre
// traduction, sans dépendre du texte exact du message — voir
// client/src/lib/serverErrorCodes.js.

export const AUTH_ERRORS = {
  PHONE_EXISTS: { message: "Phone number already registered", code: "PHONE_EXISTS" },
  INVALID_CREDENTIALS: { message: "Invalid phone or PIN", code: "INVALID_CREDENTIALS" },
  REFRESH_TOKEN_INVALID: { message: "Invalid or expired refresh token", code: "REFRESH_TOKEN_INVALID" },
  REFRESH_TOKEN_REVOKED: { message: "Refresh token revoked or expired", code: "REFRESH_TOKEN_REVOKED" },
  USER_NOT_FOUND: { message: "User not found", code: "USER_NOT_FOUND" },
  UNAUTHORIZED: { message: "Authentication required", code: "UNAUTHORIZED" },
};

export const WALLET_ERRORS = {
  WALLET_NOT_FOUND: { message: "Wallet not found", code: "WALLET_NOT_FOUND" },
  RECEIVER_NOT_FOUND: { message: "Receiver not found", code: "RECEIVER_NOT_FOUND" },
  SELF_TRANSFER: { message: "You cannot transfer money to yourself", code: "SELF_TRANSFER" },
  INSUFFICIENT_FUNDS: { message: "Insufficient balance", code: "INSUFFICIENT_FUNDS" },
  IDEMPOTENCY_KEY_REQUIRED: { message: "Idempotency-Key header is required", code: "IDEMPOTENCY_KEY_REQUIRED" },
};

export const COMMON_ERRORS = {
  GENERIC: { message: "An unexpected error occurred. Please try again later.", code: "GENERIC_ERROR" },
};