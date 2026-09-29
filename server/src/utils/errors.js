export class AppError extends Error {
  constructor(message, statusCode = 500, code = "GENERIC_ERROR") {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;
  }

  // Raccourci pour construire depuis une entrée de constants/messages.js :
  // AppError.from(WALLET_ERRORS.INSUFFICIENT_FUNDS, 400)
  static from(entry, statusCode) {
    return new AppError(entry.message, statusCode, entry.code);
  }
}