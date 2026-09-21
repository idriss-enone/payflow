import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/errors.js";

export const authenticate = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return next(new AppError("Authentication required", 401));
    }

    const [scheme, token] = authorization.split(" ");
    if (scheme !== "Bearer" || !token) {
        return next(new AppError("Invalid authorization header", 401));
    }

    try {
        const payload = verifyAccessToken(token);
        if (payload.type !== "access") throw new Error();
        req.user = { id: payload.sub };
        next();
    } catch {
        next(new AppError("Invalid or expired access token", 401));
    }
};