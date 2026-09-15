import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { installAuthMock } from "@/features/auth/mocks/authServerMock";
import { installWalletMock } from "@/features/wallet/mocks/walletServerMock";
import sessionService from "@/features/auth/services/session.service";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";
const useRealBackend = import.meta.env.VITE_AUTH_BACKEND === "api";


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

        if (error.response?.status === 401 && !isAuthEndpoint) {
            sessionService.clearAuth();
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);


if (!useRealBackend) {
    const mock = new MockAdapter(httpClient, { delayResponse: 500 });
    installAuthMock(mock);
    installWalletMock(mock);
}