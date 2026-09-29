import { useState, useEffect, useCallback, useMemo } from "react";
import WalletContext from "./WalletContext";
import walletService from "../services/wallet.service";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function WalletProvider({ children }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;

    async function refresh() {
      setIsLoading(true);
      setError("");
      try {
        const summary = await walletService.getSummary();
        if (active) {
          setBalance(summary.balance);
          setTransactions(summary.transactions);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    refresh();
    return () => {
      active = false;
    };
  }, [user]);

  const runAction = useCallback((serviceCall) => {
    return serviceCall().then((result) => {
      setBalance(result.balance);
      setTransactions((prev) => [result.transaction, ...prev].slice(0, 20));
      return result.transaction;
    });
  }, []);

  const transfer = useCallback(
    (recipientPhone, amount, note) =>
      runAction(() => walletService.transfer({ recipientPhone, amount, note })),
    [runAction],
  );

  const payBill = useCallback(
    (billerName, reference, amount) =>
      runAction(() => walletService.payBill({ billerName, reference, amount })),
    [runAction],
  );

  const topUp = useCallback(
    (amount, channelName) =>
      runAction(() => walletService.topUp({ amount, channelName })),
    [runAction],
  );

  const withdraw = useCallback(
    (amount, channelName) =>
      runAction(() => walletService.withdraw({ amount, channelName })),
    [runAction],
  );

  const value = useMemo(
    () => ({
      balance,
      transactions,
      isLoading,
      error,
      transfer,
      payBill,
      topUp,
      withdraw,
    }),
    [
      balance,
      transactions,
      isLoading,
      error,
      transfer,
      payBill,
      topUp,
      withdraw,
    ],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
