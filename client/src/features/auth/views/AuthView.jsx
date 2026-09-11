import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import FormInput from "@/components/FormField";
import { LogIn, UserPlus, Loader2, Globe } from "lucide-react";

export default function AuthView() {
  const { login, register } = useAuth();
  const { lang, changeLanguage, t } = useTranslation();

  const [view, setView] = useState("login"); // login | signup
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pin: "",
    pinConfirm: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleViewChange = (newView) => {
    setView(newView);
    setError("");
    setForm({ name: "", email: "", phone: "", pin: "", pinConfirm: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (view === "login") {
        await login(form.phone, form.pin);
      } else {
        if (!form.name || !form.phone || !form.pin || !form.pinConfirm) {
          throw new Error("auth.error_incomplete");
        }
        if (form.pin !== form.pinConfirm) {
          throw new Error("auth.pin_mismatch_error"); // Clé optionnelle à ajouter au dictionnaire si besoin
        }
        await register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          pin: form.pin,
        });
      }
    } catch (err) {
      // Traduit dynamiquement le message d'erreur si c'est une clé i18n, sinon affiche le texte brut
      setError(t(err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-pf-bg select-none relative">
      {/* SÉLECTEUR DE LANGUE FLOTTANT (i18n) */}
      <div className="absolute top-5 right-5 bg-pf-surface border border-pf-border rounded-full p-1 flex items-center gap-1 shadow-sm">
        <Globe size={14} className="text-pf-ink-faint ml-2" />
        <button
          onClick={() => changeLanguage("fr")}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${lang === "fr" ? "bg-pf-teal text-white" : "text-pf-ink-dim hover:bg-pf-bg"}`}
        >
          FR
        </button>
        <button
          onClick={() => changeLanguage("en")}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${lang === "en" ? "bg-pf-teal text-white" : "text-pf-ink-dim hover:bg-pf-bg"}`}
        >
          EN
        </button>
      </div>

      {/* BOÎTE D'AUTHENTIFICATION PRINCIPALE */}
      <div className="w-full max-w-[420px] bg-pf-surface border border-pf-border rounded-2xl p-8 shadow-xl transition-all duration-300">
        <div className="font-serif text-3xl font-bold text-center text-pf-teal-dark tracking-wide">
          Pay<span className="text-pf-sun">Flow</span>
        </div>
        <p className="text-center text-[12px] text-pf-ink-dim mt-1.5 mb-6 leading-relaxed font-medium">
          {t("auth.subtitle")}
        </p>

        {/* COMMUTATEUR ONGLETS CONNEXION / INSCRIPTION */}
        <div className="grid grid-cols-2 bg-pf-bg rounded-xl p-1 mb-5 border border-pf-border">
          <button
            type="button"
            disabled={isSubmitting}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${view === "login" ? "bg-pf-surface text-pf-teal-dark shadow-xs" : "text-pf-ink-dim hover:text-pf-ink"}`}
            onClick={() => handleViewChange("login")}
          >
            {t("auth.login")}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${view === "signup" ? "bg-pf-surface text-pf-teal-dark shadow-xs" : "text-pf-ink-dim hover:text-pf-ink"}`}
            onClick={() => handleViewChange("signup")}
          >
            {t("auth.signup")}
          </button>
        </div>

        {/* AFFICHAGE DES ERREURS LOGIQUES OU RÉSEAU SIMULÉES */}
        {error && (
          <div className="p-3.5 mb-4 text-xs font-semibold border rounded-lg bg-pf-coral-dim text-pf-coral border-pf-coral/15 leading-relaxed animate-fade-in">
            {error}
          </div>
        )}

        {/* FORMULAIRE DE SAISIE AVEC COMPOSANTS ABSTRAITS */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {view === "signup" && (
            <FormInput
              label={t("auth.fullname")}
              placeholder="Ex. Adèle Kamga"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={isSubmitting}
              required
            />
          )}

          <FormInput
            label={t("auth.phone")}
            placeholder="Ex. 670000001"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            disabled={isSubmitting}
            required
          />

          <FormInput
            label={t("auth.pin")}
            type="password"
            placeholder="••••"
            maxLength={4}
            inputMode="numeric"
            value={form.pin}
            onChange={(e) =>
              setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })
            }
            disabled={isSubmitting}
            required
          />

          {view === "signup" && (
            <FormInput
              label={t("auth.pin_confirm")}
              type="password"
              placeholder="••••"
              maxLength={4}
              inputMode="numeric"
              value={form.pinConfirm}
              onChange={(e) =>
                setForm({
                  ...form,
                  pinConfirm: e.target.value.replace(/\D/g, ""),
                })
              }
              disabled={isSubmitting}
              required
            />
          )}

          {/* BOUTON D'ENVOI AVEC ETAT DE CHARGEMENT TECHNIQUE */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full bg-pf-teal-dark text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wide cursor-pointer transition-colors hover:bg-pf-teal disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : view === "login" ? (
              <LogIn size={16} />
            ) : (
              <UserPlus size={16} />
            )}
            {isSubmitting
              ? t("common.loading")
              : view === "login"
                ? t("auth.btn_login")
                : t("auth.btn_signup")}
          </button>
        </form>
      </div>
    </div>
  );
}
