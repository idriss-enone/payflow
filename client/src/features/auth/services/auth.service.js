import { httpClient } from "@/lib/httpClient";
import sessionService from "./session.service";
import { resolveServerErrorKey } from "@/lib/serverErrorCodes";


const FALLBACK_ERROR_KEY = "common.error_generic";

function extractErrorMessage(error) {
    const data = error.response?.data;
    if (!data) return FALLBACK_ERROR_KEY;
    const localKey = resolveServerErrorKey(data.code);
    return localKey || data.message || FALLBACK_ERROR_KEY;
}

const authService = {
    async login(phone, pin) {
        try {
            const { data } = await httpClient.post("/auth/login", { phone, pin });
            return data;
        } catch (error) {
            throw new Error(extractErrorMessage(error), { cause: error });
        }
    },


    async register(userData) {
        try {
            const { data } = await httpClient.post("/auth/register", userData);
            return data;
        } catch (error) {
            throw new Error(extractErrorMessage(error), { cause: error });
        }
    },
    async logout() {
        const refreshToken = sessionService.getRefreshToken();
        try {
            await httpClient.post("/auth/logout", { refreshToken });
        } catch {
            // Non bloquant : la session locale doit être nettoyée même si la
            // révocation côté serveur échoue (serveur injoignable, etc.).
        }
        return true;
    }
};

export default authService;