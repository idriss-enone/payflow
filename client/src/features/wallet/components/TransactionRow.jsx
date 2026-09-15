import { useMemo } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  PlusCircle,
  MinusCircle,
  Receipt,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { formatXAF, formatDateTime } from "../utils/format";
import { TX_KIND } from "../constants/wallet.constants";
import StatusBadge from "./StatusBadge";

const TX_CONFIGS = {
  [TX_KIND.TRANSFER_IN]: {
    icon: ArrowDownLeft,
    label: "wallet.kind_transfer_in",
  },
  [TX_KIND.TRANSFER_OUT]: {
    icon: ArrowUpRight,
    label: "wallet.kind_transfer_out",
  },
  [TX_KIND.BILL]: {
    icon: Receipt,
    label: "wallet.kind_bill",
  },
  [TX_KIND.TOPUP]: {
    icon: PlusCircle,
    label: "wallet.kind_topup",
  },
  [TX_KIND.WITHDRAWAL]: {
    icon: MinusCircle,
    label: "wallet.kind_withdrawal",
  },
};

function counterpartLabel(tx) {
  return tx.counterpartyName || tx.billerName || tx.channelName || "";
}

export default function TransactionRow({ tx, onSelect }) {
  const { t } = useTranslation();
  const config = useMemo(() => TX_CONFIGS[tx.kind] || {}, [tx.kind]);
  const Icon = config.icon || Receipt;
  const positive = tx.amount > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(tx)}
      className="w-full flex items-center gap-3 py-2.5 border-b border-pf-border last:border-b-0 text-left hover:bg-pf-surface-alt rounded-lg px-2 -mx-2"
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          positive
            ? "bg-pf-teal-dim text-pf-teal-dark"
            : "bg-pf-coral-dim text-pf-coral"
        }`}
      >
        <Icon size={16} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-pf-ink truncate">
          {t(config.label)} {counterpartLabel(tx)}
        </div>
        <div className="text-[11px] text-pf-ink-faint">
          {formatDateTime(tx.createdAt)}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div
          className={`text-sm font-mono font-semibold whitespace-nowrap ${positive ? "text-pf-teal-dark" : "text-pf-coral"}`}
        >
          {positive ? "+" : ""}
          {formatXAF(tx.amount)}
        </div>
        <StatusBadge status={tx.status} />
      </div>
    </button>
  );
}
