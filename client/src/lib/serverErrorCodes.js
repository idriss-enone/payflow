const CODE_TO_I18N_KEY = {
  RECEIVER_NOT_FOUND: "wallet.error_recipient_not_found",
  SELF_TRANSFER: "wallet.error_self_transfer",
  INSUFFICIENT_FUNDS: "wallet.insufficient_funds",
  WALLET_NOT_FOUND: "common.error_generic",
  IDEMPOTENCY_KEY_REQUIRED: "common.error_generic",
  PHONE_EXISTS: "auth.error_phone_exists",
  INVALID_CREDENTIALS: "auth.error_invalid_credentials",
  REFRESH_TOKEN_INVALID: "common.error_generic",
  REFRESH_TOKEN_REVOKED: "common.error_generic",
  USER_NOT_FOUND: "common.error_generic",
  UNAUTHORIZED: "common.error_generic",
};

export function resolveServerErrorKey(code) {
  return CODE_TO_I18N_KEY[code] || null;
}