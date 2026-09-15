import { useTranslation } from "@/hooks/useTranslation";
import { useWallet } from "../hooks/useWallet";
import BalanceCard from "../components/BalanceCard";
import QuickActions from "../components/QuickActions";
import TransactionRow from "../components/TransactionRow";
//import { groupByDate } from "../utils/format";

export default function DashboardHome() {
  const { t } = useTranslation();
  const { balance, transactions, isLoading } = useWallet();
  //const grouped = groupByDate(transactions, t);

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
          transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} onSelect={() => {}} />
          ))
        )}
      </div>
    </div>
  );
}
