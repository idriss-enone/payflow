import { BrowserRouter } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AUTH_STATUS } from "@/features/auth/constants/auth.constants";
import { useTranslation } from "@/hooks/useTranslation";
import AppRoutes from "@/routes/AppRoutes";
import { Loader2 } from "lucide-react";

export default function App() {
  const { status } = useAuth();
  const { t } = useTranslation();

  // Écran d'attente initial pendant que sessionService interroge la mémoire cache
  if (status === AUTH_STATUS.CHECKING) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center min-h-screen bg-pf-bg text-pf-ink gap-3"
      >
        <Loader2
          size={32}
          className="animate-spin text-pf-teal"
          aria-hidden="true"
        />
        <p className="font-mono text-[10px] text-pf-ink-dim tracking-wider uppercase font-semibold">
          {t("auth.checking")}
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
