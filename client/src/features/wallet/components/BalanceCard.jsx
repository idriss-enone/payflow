import { Wallet } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { formatXAF } from "../utils/format";

export default function BalanceCard({ balance }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-pf-teal-dark to-pf-teal text-white mb-5">
      <div className="flex items-center justify-between">
        <span className="text-xs opacity-80">{t("wallet.balance_label")}</span>
        <Wallet size={18} aria-hidden="true" className="opacity-80" />
      </div>
      <div className="text-3xl font-bold mt-2 font-mono tabular-nums">{formatXAF(balance)}</div>
    </div>
  );
}