import { useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { TX_STATUS } from "../constants/wallet.constants";
import { Clock, Loader2, CheckCircle2, XCircle } from "lucide-react";

const BADGE_CONFIGS = {
  [TX_STATUS.PENDING]: {
    icon: Clock,
    classes: "text-pf-ink-muted bg-pf-ink-muted/10 border-pf-ink-muted/20",
    label: "PENDING",
  },
  [TX_STATUS.PROCESSING]: {
    icon: Loader2,
    classes: "text-pf-processing bg-pf-processing/10 border-pf-processing/20",
    label: "PROCESSING",
    spin: true,
  },
  [TX_STATUS.SUCCESS]: {
    icon: CheckCircle2,
    classes: "bg-pf-teal-dim text-pf-teal-dark ",
    label: "wallet.status_success",
  },
  [TX_STATUS.FAILED]: {
    icon: XCircle,
    classes: "bg-pf-coral-dim text-pf-coral",
    label: "wallet.status_failed",
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
      className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold px-2 py-0.5 rounded-sm transition-colors duration-200 ${conf.classes} 
        ${className}`.trim()}
    >
      <Icon size={11} className={conf.spin ? "animate-spin" : ""} />
      {t(conf.label)}
    </span>
  );
}
