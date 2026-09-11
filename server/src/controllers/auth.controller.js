export async function login(req, res) {
  // TODO: vérifier { phone, pin } contre la base PostgreSQL
  res.status(501).json({ message: "auth.error_not_implemented" });
}

export async function register(req, res) {
  // TODO: créer l'utilisateur en base, avec un vrai hachage du PIN
  res.status(501).json({ message: "auth.error_not_implemented" });
}

export async function logout(req, res) {
  // TODO: invalider le refresh token côté serveur
  res.status(204).send();
}