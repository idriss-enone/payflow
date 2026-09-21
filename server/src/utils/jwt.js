import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user.id, type: "access" },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
  );
};

// jti (JWT ID) porte l'id de la ligne refresh_tokens correspondante —
// c'est ce qui permet de retrouver puis révoquer CE token précis en base,
// sans avoir à stocker ou comparer le JWT complet.
export const generateRefreshToken = (user, tokenId) => {
  return jwt.sign(
    { sub: user.id, jti: tokenId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );
};

export const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);
export const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);