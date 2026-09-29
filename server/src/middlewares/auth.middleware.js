import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/errors.js";
import { AUTH_ERRORS } from "../constants/messages.js";

export const authenticate = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  if (!authorization) {
    return next(AppError.from(AUTH_ERRORS.UNAUTHORIZED, 401));
  }

  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(AppError.from(AUTH_ERRORS.UNAUTHORIZED, 401));
  }

  try {
    const payload = verifyAccessToken(token);
    if (payload.type !== "access") throw new Error();
    req.user = { id: payload.sub };
    next();
  } catch {
    next(AppError.from(AUTH_ERRORS.UNAUTHORIZED, 401));
  }
};