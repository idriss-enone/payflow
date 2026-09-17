import jwt from "jsonwebtoken";

// Vérifie le token JWT sur les routes protégées, attache l'id de
// l'utilisateur à req.userId. Aucune route pour l'instant ne l'utilise
// hormis /auth/me (ci-dessous), mais c'est ce middleware qui servira
// aussi pour les futures routes du wallet, une fois construites ici.
export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: "auth.error_invalid_credentials" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.sub;
        next();
    } catch {
        return res.status(401).json({ message: "auth.error_invalid_credentials" });
    }
}