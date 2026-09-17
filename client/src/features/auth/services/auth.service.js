import { httpClient } from "@/lib/httpClient";


const FALLBACK_ERROR_KEY = "common.error_generic";

function extractErrorMessage(error) {
    return error.response?.data?.message || FALLBACK_ERROR_KEY;
}

const authService = {
    async login(phone, pin) {
        try {
            console.log(phone)
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
        await httpClient.post("/auth/logout");
        return true;
    }
};

export default authService;