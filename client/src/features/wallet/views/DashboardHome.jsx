import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useWallet } from "../hooks/useWallet";
import BalanceCard from "../components/BalanceCard";
import QuickActions from "../components/QuickActions";
import TransactionRow from "../components/TransactionRow";
import TransactionDetailModal from "../components/TransactionDetailModal";
import { groupByDate } from "../utils/format";

export default function DashboardHome() {
  const { t } = useTranslation();
  const { balance, transactions, isLoading } = useWallet();
  const grouped = groupByDate(transactions, t);
  const [selectedTx, setSelectedTx] = useState(null);

  return (
    <div>
      <BalanceCard balance={balance} />
      <QuickActions />

      <div className="pf-panel p-4">
        <h1 className="text-sm font-semibold text-pf-ink mb-2">
          {t("wallet.recent_activity")}
        </h1>

        {isLoading ? (
          <p className="text-sm text-pf-ink-dim">{t("common.loading")}</p>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-pf-ink-faint">{t("wallet.no_activity")}</p>
        ) : (
          grouped.map((group) => (
            <div key={group.label} className="mb-3 last:mb-0">
              <div className="text-[11px] font-semibold text-pf-ink-faint mb-1">
                {group.label}
              </div>
              {group.items.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} onSelect={setSelectedTx} />
              ))}
            </div>
          ))
        )}
      </div>
      <TransactionDetailModal
        tx={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
}
