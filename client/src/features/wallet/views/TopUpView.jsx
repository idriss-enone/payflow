import { useTranslation } from "@/hooks/useTranslation";
import { useTopUpForm } from "../hooks/useTopUpForm";
import { CASH_CHANNELS } from "../data/mockChannels";
import RadioOption from "../components/RadioOption";
import FormInput from "@/components/FormInput";
import { PlusCircle, Loader2 } from "lucide-react";

export default function TopUpView() {
  const { t } = useTranslation();
  const {
    user,
    channelId,
    setChannelId,
    amount,
    setAmount,
    fieldErrors,
    formError,
    isSubmitting,
    handleSubmit,
  } = useTopUpForm();

  return (
    <div className="animate-fade-in flex flex-col gap-6 ">
      <div className="pf-panel p-5">
        <div className="pf-panel-head mb-4">
          <h1 className="text-base font-semibold text-pf-ink mb-1">
            {" "}
            {t("wallet.topup_title")}{" "}
          </h1>
          <p className="text-xs text-pf-ink-faint"> {t("wallet.topup_description")} </p>
        </div>
        <div className="pf-panel-body">
          <div
            role="radiogroup"
            aria-label={t("wallet.topup_channel_label")}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {CASH_CHANNELS.map((c) => (
              <RadioOption
                key={c.id}
                label={c.name}
                selected={channelId === c.id}
                onSelect={() => setChannelId(c.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pf-panel p-5">
        <div className="pf-panel-head mb-4">
          {" "}
          <h2 className="text-base font-semibold text-pf-ink">
            {" "}
            {t("wallet.topup_subtitle")}{" "}
          </h2>{" "}
        </div>
        <div className="pf-panel-body">
          {formError && (
            <div
              role="alert"
              className="p-3 mb-4 text-xs font-semibold border rounded-lg bg-pf-coral-dim text-pf-coral border-pf-coral/15"
            >
              {t(formError)}
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
              value={user.phone}
              disabled
            />

            <FormInput
              id="amount"
              label={t("wallet.amount")}
              type="number"
              inputMode="numeric"
              placeholder="Ex. 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={fieldErrors.amount}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="flex items-center justify-center gap-2 w-full bg-pf-teal-dark text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wide cursor-pointer transition-colors hover:bg-pf-teal disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {isSubmitting ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <PlusCircle size={16} aria-hidden="true" />
              )}
              {isSubmitting ? t("common.loading") : t("wallet.btn_topup")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
