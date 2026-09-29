import { useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { TX_STATUS } from "../constants/wallet.constants";
import { Clock, Loader2, CheckCircle2, XCircle, Ban } from "lucide-react";

const BADGE_CONFIGS = {
  [TX_STATUS.PENDING]: {
    icon: Clock,
    classes: "bg-pf-surface-alt text-pf-ink-dim",
    label: "wallet.status_pending",
  },
  [TX_STATUS.PROCESSING]: {
    icon: Loader2,
    classes: "bg-pf-sun-dim text-pf-sun",
    label: "wallet.status_processing",
    spin: true,
  },
  [TX_STATUS.SUCCESS]: {
    icon: CheckCircle2,
    classes: "bg-pf-teal-dim text-pf-teal-dark",
    label: "wallet.status_success",
  },
  [TX_STATUS.FAILED]: {
    icon: XCircle,
    classes: "bg-pf-coral-dim text-pf-coral",
    label: "wallet.status_failed",
  },
  [TX_STATUS.CANCELLED]: {
    icon: Ban,
    classes: "bg-pf-surface-alt text-pf-ink-faint",
    label: "wallet.status_cancelled",
  },
};

export default function StatusBadge({ status, className = "" }) {
  const { t } = useTranslation();
  const conf = useMemo(
    () => BADGE_CONFIGS[status] || BADGE_CONFIGS[TX_STATUS.PENDING],
    [status],
  );
  const Icon = conf.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full ${conf.classes} ${className}`.trim()}
    >
      <Icon
        size={11}
        className={conf.spin ? "animate-spin" : ""}
        aria-hidden="true"
      />
      {t(conf.label)}
    </span>
  );
}
