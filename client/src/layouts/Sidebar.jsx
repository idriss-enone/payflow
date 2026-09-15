import { useEffect, useRef } from "react";
import { Wallet, Send, Receipt, PlusCircle, MinusCircle, History } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import SidebarLink from "./SidebarLink";

const NAV_ITEMS = [
  { to: "/dashboard", end: true, icon: Wallet, key: "wallet.nav_home" },
  { to: "/dashboard/transfer", icon: Send, key: "wallet.action_transfer" },
  { to: "/dashboard/bill", icon: Receipt, key: "wallet.action_bill" },
  { to: "/dashboard/recharge", icon: PlusCircle, key: "wallet.action_topup" },
  { to: "/dashboard/withdraw", icon: MinusCircle, key: "wallet.action_withdrawal" },
  { to: "/dashboard/history", icon: History, key: "wallet.see_all" },
];

export default function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const panelRef = useRef(null);

  // À l'ouverture en mobile : focus sur le premier lien. À tout moment :
  // Échap ferme le tiroir.
  useEffect(() => {
    if (!isOpen) return;
    panelRef.current?.querySelector("a")?.focus();
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Fond semi-transparent, uniquement en mobile quand le tiroir est ouvert */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <nav
        ref={panelRef}
        id="dashboard-sidebar"
        aria-label={t("wallet.nav_label")}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-pf-surface border-r border-pf-border p-4
          flex flex-col gap-1 transition-transform duration-200 motion-reduce:transition-none
          md:static md:translate-x-0 md:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="font-serif text-lg font-bold text-pf-teal-dark px-2 mb-4">
          Pay<span className="text-pf-sun">Flow</span>
        </div>

        {NAV_ITEMS.map(({ to, end, icon, key }) => (
          <SidebarLink key={to} to={to} end={end} icon={icon} label={t(key)} onNavigate={onClose} />
        ))}
      </nav>
    </>
  );
}