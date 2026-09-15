import { Menu, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar({ onOpenSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-pf-surface border-b border-pf-border px-4 py-3">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-expanded={isSidebarOpen}
        aria-controls="dashboard-sidebar"
        aria-label={t("wallet.toggle_menu")}
        className="md:hidden text-pf-ink-dim hover:text-pf-ink p-1.5 -ml-1.5 rounded-lg hover:bg-pf-surface-alt"
      >
        <Menu size={20} />
      </button>

      <div className="font-serif text-base font-bold text-pf-teal-dark md:hidden">
        Pay<span className="text-pf-sun">Flow</span>
      </div>

      <div className="flex-1 hidden md:block" />

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <span className="hidden sm:inline text-xs text-pf-ink-dim">{user?.name}</span>
        <button
          type="button"
          onClick={logout}
          aria-label={t("common.logout")}
          className="text-pf-ink-faint hover:text-pf-coral p-1.5 rounded-full hover:bg-pf-coral-dim"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}