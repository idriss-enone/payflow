import { useState, useEffect, useMemo } from "react";
import AuthContext from "./AuthContext";
import authService from "../services/auth.service";
import sessionService from "../services/session.service";
import { AUTH_STATUS } from "../constants/auth.constants";

/**
 * Fournisseur d'état global pour le module d'Authentification
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(AUTH_STATUS.CHECKING);
  const isAuthenticated = status === AUTH_STATUS.AUTHENTICATED;

  /**
   * Initialisation asynchrone sécurisée via la couche sessionService
   */
  useEffect(() => {
    const initializeAuthSession = () => {
      try {
        const cachedUser = sessionService.getUser();
        if (cachedUser) {
          setUser(cachedUser);
          setStatus(AUTH_STATUS.AUTHENTICATED);
        } else {
          setStatus(AUTH_STATUS.UNAUTHENTICATED);
        }
      } catch (error) {
        console.error("[AuthProvider Initialization Error]", error);
        sessionService.clearAuth();
        setStatus(AUTH_STATUS.UNAUTHENTICATED);
      }
    };

    initializeAuthSession();
  }, []);

  const login = async (phone, pin) => {
    const session = await authService.login(phone, pin);
    sessionService.save(session); // Utilisation de votre méthode groupée propre
    setUser(session.user);
    setStatus(AUTH_STATUS.AUTHENTICATED);
    return session.user;
  };

  const register = async (userData) => {
    const session = await authService.register(userData);
    sessionService.save(session);
    setUser(session.user);
    setStatus(AUTH_STATUS.AUTHENTICATED);
    return session.user;
  };

  const logout = async () => {
    await authService.logout();
    sessionService.clearAuth();
    setUser(null);
    setStatus(AUTH_STATUS.UNAUTHENTICATED);
  };

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated,
      login,
      logout,
      register,
      setUser,
    }),
    [user, status, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
