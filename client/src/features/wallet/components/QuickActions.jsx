import { Link } from "react-router-dom";
import { Send, Receipt, PlusCircle, MinusCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const ACTIONS = [
  { to: "/dashboard/transfer", icon: Send, key: "wallet.action_transfer" },
  { to: "/dashboard/bill", icon: Receipt, key: "wallet.action_bill" },
  { to: "/dashboard/recharge", icon: PlusCircle, key: "wallet.action_topup" },
  { to: "/dashboard/withdraw", icon: MinusCircle, key: "wallet.action_withdrawal" },
];

export default function QuickActions() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-4 gap-2 mb-5">
      {ACTIONS.map(({ to, icon: Icon, key }) => (
        <Link
          key={to}
          to={to}
          className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-pf-border hover:border-pf-teal hover:bg-pf-teal-dim transition-colors text-center"
        >
          <Icon size={18} className="text-pf-teal-dark" aria-hidden="true" />
          <span className="text-[11px] font-medium text-pf-ink">{t(key)}</span>
        </Link>
      ))}
    </div>
  );
}