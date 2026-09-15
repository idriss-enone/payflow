import { httpClient } from "@/lib/httpClient";


const FALLBACK_ERROR_KEY = "common.error_generic";

function extractErrorMessage(error) {
    return error.response?.data?.message || FALLBACK_ERROR_KEY;
}
const walletService = {

    async getSummary(userId) {
        try {
            const { data } = await httpClient.get("/wallet/summary", { params: { userId } });
            return data;
        } catch (error) {
            throw new Error(extractErrorMessage(error), { cause: error });
        }
    },
    async getTransactions(userId) {
        try {
            const { data } = await httpClient.get("/wallet/transactions", { params: { userId } });
            return data.transactions;
        } catch (error) {
            throw new Error(extractErrorMessage(error), { cause: error });
        }
    },
    async transfer(payload) {
        try {
            const { data } = await httpClient.post("/wallet/transfer", payload);
            return data;
        } catch (error) {
            throw new Error(extractErrorMessage(error), { cause: error });
        }
    },
}

export default walletService;