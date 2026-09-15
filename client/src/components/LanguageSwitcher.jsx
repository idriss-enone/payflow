import { Globe } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

// Composant partagé : déjà présent visuellement dans AuthLayout,
// maintenant aussi dans la navbar du dashboard. Un seul endroit à maintenir.
export default function LanguageSwitcher() {
  const { lang, changeLanguage, t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t("common.language_switcher")}
      className="bg-pf-bg border border-pf-border rounded-full p-1 flex items-center gap-1"
    >
      <Globe size={14} className="text-pf-ink-faint ml-2" aria-hidden="true" />
      <button
        onClick={() => changeLanguage("fr")}
        aria-pressed={lang === "fr"}
        className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
          lang === "fr"
            ? "bg-pf-teal text-white"
            : "text-pf-ink-dim hover:bg-pf-surface-alt"
        }`}
      >
        FR
      </button>
      <button
        onClick={() => changeLanguage("en")}
        aria-pressed={lang === "en"}
        className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
          lang === "en"
            ? "bg-pf-teal text-white"
            : "text-pf-ink-dim hover:bg-pf-surface-alt"
        }`}
      >
        EN
      </button>
    </div>
  );
}
