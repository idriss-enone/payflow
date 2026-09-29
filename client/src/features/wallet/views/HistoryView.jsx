import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useWallet } from "../hooks/useWallet";
import { formatXAF, formatDateTime } from "../utils/format";
import StatusBadge from "../components/StatusBadge";

const KIND_LABELS = {
  TOP_UP: "Recharge",
  WITHDRAWAL: "Retrait",
  TRANSFER: "Transfert",
  BILL_PAYMENT: "Facture",
};

function operationLabel(tx) {
  return tx.channelName || KIND_LABELS[tx.kind] || tx.kind;
}

export default function HistoryView() {
  const { t } = useTranslation();
  const { isLoading, transactions } = useWallet();
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filteredTransactions = useMemo(() => {
    if (typeFilter === "ALL") return transactions;
    return transactions.filter((tx) => tx.kind === typeFilter);
  }, [transactions, typeFilter]);

  const TYPE_FILTERS = [
    { value: "ALL", label: t("wallet.filter_all") },
    { value: "TOP_UP", label: t("wallet.filter_topups") },
    { value: "WITHDRAWAL", label: t("wallet.filter_withdrawals") },
    { value: "TRANSFER", label: t("wallet.filter_transfers") },
    { value: "BILL_PAYMENT", label: t("wallet.filter_bills") },
  ];

  return (
    <div className="pf-panel p-5 animate-fade-in">
      <h1 className="text-base font-semibold text-pf-ink mb-4">
        {t("wallet.history_title")}
      </h1>

      <div className="p-4 flex flex-wrap justify-between items-center gap-4 bg-pf-surface-alt/20 rounded-lg mb-4">
        <div className="text-xs font-semibold text-pf-ink-faint flex items-center gap-2">
          <Filter size={14} className="text-pf-sun" aria-hidden="true" />
          <span>
            {t("wallet.filter_search")}
            ({filteredTransactions.length} {t("wallet.results")})
          </span>
        </div>

        <div className="pf-field">
          <label htmlFor="tx-type-filter" className="sr-only">
            {t("wallet.filter_by_type")}
          </label>
          <select
            id="tx-type-filter"
            className="bg-pf-bg border border-pf-border text-pf-ink px-3 py-1.5 text-xs rounded-md font-medium cursor-pointer outline-none focus:border-pf-teal"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {TYPE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pf-panel-body p-0 overflow-x-auto">
        {isLoading ? (
          <p className="text-sm text-pf-ink-dim p-6">{t("common.loading")}</p>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-sm text-pf-ink-faint">
            {t("wallet.no_activity")}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-sm text-pf-ink-faint">
            {t("wallet.no_results")}
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-pf-border bg-pf-bg/40 font-mono text-[11px] font-semibold text-pf-ink-faint uppercase tracking-wider">
                <th className="px-6 py-3.5">{t("wallet.timestamp")}</th>
                <th className="px-6 py-3.5">{t("wallet.transaction_reference")}</th>
                <th className="px-6 py-3.5">{t("wallet.operation_label")}</th>
                <th className="px-6 py-3.5">{t("wallet.amount_label")}</th>
                <th className="px-6 py-3.5">{t("wallet.status_label")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pf-border">
              {filteredTransactions.map((tx) => {
                const isDebit = tx.amount < 0;
                return (
                  <tr
                    key={tx.id}
                    className="transition-colors hover:bg-pf-surface-alt/40"
                  >
                    <td className="px-6 py-4 text-pf-ink-faint whitespace-nowrap">
                      {formatDateTime(tx.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-pf-ink-faint whitespace-nowrap select-all">
                      {tx.reference}
                    </td>
                    <td className="px-6 py-4 font-medium text-pf-ink">
                      {operationLabel(tx)}
                    </td>
                    <td
                      className={`px-6 py-4 font-mono font-bold whitespace-nowrap ${isDebit ? "text-pf-coral" : "text-pf-teal-dark"}`}
                    >
                      {isDebit ? "-" : "+"}
                      {formatXAF(Math.abs(tx.amount))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={tx.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
