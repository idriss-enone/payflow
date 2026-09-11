import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useLoginForm } from "../hooks/useLoginForm";
import FormInput from "@/components/FormInput";
import { LogIn, Loader2, Lock } from "lucide-react";

export default function LoginView() {
  const { t } = useTranslation();
  const {
    phone,
    setPhone,
    pin,
    setPin,
    fieldErrors,
    formError,
    isSubmitting,
    handleSubmit,
  } = useLoginForm();
  return (
    <div>
      <div className="flex justify-center mb-4">
        <div
          className="w-11 h-11 rounded-full bg-pf-teal-dim text-pf-teal-dark flex items-center justify-center"
          aria-hidden="true"
        >
          <Lock size={20} />
        </div>
      </div>
      <div className="font-serif text-3xl font-bold text-center text-pf-teal-dark tracking-wide">
        Pay<span className="text-pf-sun">Flow</span>
      </div>
      <p className="text-center text-[12px] text-pf-ink-dim mt-1.5 mb-6 leading-relaxed font-medium">
        {t("auth.login_subtitle")}
      </p>
      <div className="animate-fade-in">
        {formError && (
          <div
            role="alert"
            className="p-3.5 mb-4 text-xs font-semibold border rounded-lg bg-pf-coral-dim text-pf-coral border-pf-coral/15 leading-relaxed"
          >
            {formError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          <FormInput
            id="phone"
            label={t("auth.phone")}
            placeholder="Ex. 670000001"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={fieldErrors.phone}
            disabled={isSubmitting}
            required
          />

          <FormInput
            id="pin"
            label={t("auth.pin")}
            type="password"
            placeholder="••••"
            maxLength={4}
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            error={fieldErrors.pin}
            disabled={isSubmitting}
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="flex items-center justify-center gap-2 w-full bg-pf-teal-dark text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wide cursor-pointer transition-colors hover:bg-pf-teal disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <LogIn size={16} aria-hidden="true" />
            )}
            {isSubmitting ? t("common.loading") : t("auth.btn_login")}
          </button>
        </form>

        <div className="text-center text-xs font-semibold text-pf-ink-dim mt-5">
          {t("auth.no_account")}{" "}
          <Link
            to="/register"
            className="text-pf-teal hover:underline transition-all"
          >
            {t("auth.switch_signup")}
          </Link>
        </div>
      </div>
    </div>
  );
}
