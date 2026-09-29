import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { formatXAF } from "../utils/format";
import StatusBadge from "./StatusBadge";

export default function TransactionDetailModal({ tx, onClose }) {
  const { t } = useTranslation();
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!tx) return null;
  const positive = tx.amount > 0;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tx-modal-title"
        className="bg-pf-surface rounded-2xl p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 id="tx-modal-title" className="text-sm font-semibold text-pf-ink">
            {t("wallet.transaction_details")}
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={t("common.close")}
            className="text-pf-ink-faint hover:text-pf-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className={`text-2xl font-bold font-mono mb-1 ${positive ? "text-pf-teal-dark" : "text-pf-coral"}`}
        >
          {positive ? "+" : "-"}
          {formatXAF(Math.abs(tx.amount))}
        </div>
        <div className="mb-4">
          <StatusBadge status={tx.status} />
        </div>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-pf-ink-faint">{t("wallet.reference_label")}</dt>
            <dd className="font-mono">{tx.reference}</dd>
          </div>
          {tx.channelName && (
            <div className="flex justify-between">
              <dt className="text-pf-ink-faint">{t("wallet.source_label")}</dt>
              <dd>{tx.channelName}</dd>
            </div>
          )}
          {tx.customerReference && (
            <div className="flex justify-between">
              <dt className="text-pf-ink-faint">Référence client</dt>
              <dd className="font-mono">{tx.customerReference}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-pf-ink-faint">{t("wallet.date_label")}</dt>
            <dd>{new Date(tx.createdAt).toLocaleString("fr-FR")}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
