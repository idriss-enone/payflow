import { Outlet } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { Globe } from "lucide-react";

export default function AuthLayout() {
  const { lang, changeLanguage, t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-5 bg-pf-bg select-none relative">
      {/* SÉLECTEUR DE LANGUE — reste au fil normal sur très petit écran (sm:absolute) pour ne jamais chevaucher la carte */}
      <div
        role="group"
        aria-label={t("common.mock_env")}
        className="mb-4 sm:mb-0 sm:absolute sm:top-5 sm:right-5 bg-pf-surface border border-pf-border rounded-full p-1 flex items-center gap-1 shadow-xs"
      >
        <Globe size={14} className="text-pf-ink-faint ml-2" aria-hidden="true" />
        <button
          onClick={() => changeLanguage("fr")}
          aria-pressed={lang === "fr"}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
            lang === "fr" ? "bg-pf-teal text-white" : "text-pf-ink-dim hover:bg-pf-bg"
          }`}
        >
          FR
        </button>
        <button
          onClick={() => changeLanguage("en")}
          aria-pressed={lang === "en"}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
            lang === "en" ? "bg-pf-teal text-white" : "text-pf-ink-dim hover:bg-pf-bg"
          }`}
        >
          EN
        </button>
      </div>

      {/* CADRE CENTRAL DE SAISIE */}
      <main className="w-full max-w-[420px] bg-pf-surface border border-pf-border rounded-2xl p-6 sm:p-8 shadow-xl">
      
        <Outlet />
      </main>
    </div>
  );
}