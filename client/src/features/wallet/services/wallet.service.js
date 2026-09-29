import { httpClient } from "@/lib/httpClient";
import { resolveServerErrorKey } from "@/lib/serverErrorCodes";

const FALLBACK_ERROR_KEY = "common.error_generic";

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return FALLBACK_ERROR_KEY;
  const localKey = resolveServerErrorKey(data.code);
  return localKey || data.message || FALLBACK_ERROR_KEY;
}

function newIdempotencyKey() {
  return crypto.randomUUID();
}

const walletService = {
  async getBalance() {
    try {
      const { data } = await httpClient.get("/wallet/balance");
      return data.balance;
    } catch (error) {
      throw new Error(extractErrorMessage(error), { cause: error });
    }
  },

  async getTransactions() {
    try {
      const { data } = await httpClient.get("/wallet/transactions");
      return data.transactions;
    } catch (error) {
      throw new Error(extractErrorMessage(error), { cause: error });
    }
  },

  async getSummary() {
    try {
      const { data } = await httpClient.get("/wallet/summary");
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error), { cause: error });
    }
  },

  async transfer({ recipientPhone, amount, note }) {
    try {
      const { data } = await httpClient.post(
        "/wallet/transfer",
        { recipientPhone, amount, note },
        { headers: { "Idempotency-Key": newIdempotencyKey() } }
      );
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error), { cause: error });
    }
  },

  async payBill({ billerName, reference, amount }) {
    try {
      const { data } = await httpClient.post(
        "/wallet/bill-payment",
        { billerName, reference, amount },
        { headers: { "Idempotency-Key": newIdempotencyKey() } }
      );
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error), { cause: error });
    }
  },

  async topUp({ amount, channelName }) {
    try {
      const { data } = await httpClient.post(
        "/wallet/topup",
        { amount, channelName },
        { headers: { "Idempotency-Key": newIdempotencyKey() } }
      );
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error), { cause: error });
    }
  },

  async withdraw({ amount, channelName }) {
    try {
      const { data } = await httpClient.post(
        "/wallet/withdrawal",
        { amount, channelName },
        { headers: { "Idempotency-Key": newIdempotencyKey() } }
      );
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error), { cause: error });
    }
  },
};

export default walletService;