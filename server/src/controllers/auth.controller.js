import { authService } from "../services/auth.service.js";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validators/auth.validator.js";


export const register = async (req, res) => {
  const data = registerSchema.parse(req.body);
  const result = await authService.registerUser(data);
  res.status(201).json(result);
};

export const login = async (req, res) => {
  const data = loginSchema.parse(req.body);
  const result = await authService.loginUser(data);
  res.status(200).json(result);
};

export const refresh = async (req, res) => {
  const data = refreshTokenSchema.parse(req.body);
  const result = await authService.refreshAccessToken(data.refreshToken);
  res.status(200).json(result);
};

export const logout = async (req, res) => {
  const data = refreshTokenSchema.parse(req.body);
  await authService.logoutUser(data.refreshToken);
  res.status(204).send();
};

export const getMe = async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json({ user });
};