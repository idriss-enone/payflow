import axios from "axios";
import { installAuthMock } from "@/features/auth/mocks/authServerMock";
import sessionService from "@/features/auth/services/session.service";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";
const useRealBackend = import.meta.env.VITE_AUTH_BACKEND === "api";

// Endpoints où un 401 signifie "identifiants refusés", pas "session expirée" —
// il ne faut surtout pas déclencher une déconnexion globale sur un simple
// mauvais mot de passe à l'écran de connexion.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register"];

export const httpClient = axios.create({
    baseURL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.request.use((config) => {
    const token = sessionService.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => error.config?.url?.includes(path));

        // Un 401 sur une route PROTÉGÉE (pas login/register elle-même) veut dire
        // que le token n'est plus valide : on nettoie et on renvoie vers /login.
        if (error.response?.status === 401 && !isAuthEndpoint) {
            sessionService.clearAuth();
            // window.location plutôt que useNavigate() : un intercepteur axios vit
            // en dehors de l'arbre React, il n'a pas accès aux hooks du routeur.
            // Le rechargement complet a aussi l'avantage de réinitialiser tout
            // l'état React (AuthProvider inclus) sans logique supplémentaire.
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);


if (!useRealBackend) {
    installAuthMock(httpClient);
}