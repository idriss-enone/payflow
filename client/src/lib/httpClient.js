import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { installAuthMock } from "@/features/auth/mocks/authServerMock";
import sessionService from "@/features/auth/services/session.service";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";
const useRealAuthBackend = import.meta.env.VITE_AUTH_BACKEND === "api";
const useRealWalletBackend = import.meta.env.VITE_WALLET_BACKEND === "api";

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

export const httpClient = axios.create({
    baseURL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.request.use((config) => {
    const token = sessionService.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

//let refreshPromise = null;

/*function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = httpClient
            .post("/auth/refresh", { refreshToken: sessionService.getRefreshToken() })
            .then(({ data }) => {
                sessionService.saveAccessToken(data.accessToken);
                return data.accessToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}*/

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => error.config?.url?.includes(path));

        if (error.response?.status === 401 && !isAuthEndpoint) {// && !error.config._retried
            try {
                //const newAccessToken = await refreshAccessToken();
                //error.config._retried = true;
                //error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                //return httpClient(error.config);
                sessionService.clearAuth();
                window.location.href = "/login";
            } catch {
                //sessionService.clearAuth();
                //window.location.href = "/login";
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

if (!useRealAuthBackend || !useRealWalletBackend) {
    const mock = new MockAdapter(httpClient, { delayResponse: 500, onNoMatch: "passthrough" });
    if (!useRealAuthBackend) installAuthMock(mock);
}