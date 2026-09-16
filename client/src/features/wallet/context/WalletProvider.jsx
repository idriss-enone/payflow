import { useState, useEffect, useCallback, useMemo } from "react";
import WalletContext from "./WalletContext";
import walletService from "../services/wallet.service";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function WalletProvider({ children }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(user?.balance ?? 0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  /*const refresh = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError("");
    try {
      const summary = await walletService.getSummary(user.id);
      setBalance(summary.balance);
      setTransactions(summary.transactions);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);*/

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setIsLoading(true);
      setError("");
      try {
        const fetchedTransactions = await walletService.getTransactions(
          user.id,
        );
        setTransactions(fetchedTransactions);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user]);

  /*useEffect(() => {
    refresh();
  }, [refresh]);*/

  const runAction = useCallback(async (serviceCall) => {
    const result = await serviceCall();
    setBalance(result.balance);
    setTransactions((prev) => [result.transaction, ...prev].slice(0, 20));
    return result.transaction;
  }, []);

  const transfer = useCallback(
    (recipientPhone, amount, note) =>
      runAction(() =>
        walletService.transfer({
          userId: user.id,
          recipientPhone,
          amount,
          note,
        }),
      ),
    [runAction, user],
  );

  const payBill = useCallback(
    (billerName, reference, amount) =>
      runAction(() => walletService.payBill({ userId: user.id, billerName, reference, amount })),
    [runAction, user]
  );

  const value = useMemo(
    () => ({ balance, transactions, isLoading, error, transfer,payBill }),
    [balance, transactions, isLoading, error, transfer,payBill],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
