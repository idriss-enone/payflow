import { useTranslation } from "@/hooks/useTranslation";
import { useBillPaymentForm } from "../hooks/useBillPaymentForm";
import { BILLERS } from "../data/mockBillers";
import RadioOption from "../components/RadioOption";
import FormInput from "@/components/FormInput";
import { Receipt, Loader2 } from "lucide-react";

export default function BillPaymentView() {
  const { t } = useTranslation();
  const {
    billerId,
    setBillerId,
    reference,
    setReference,
    amount,
    setAmount,
    fieldErrors,
    formError,
    isSubmitting,
    handleSubmit,
  } = useBillPaymentForm();

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="pf-panel p-5 ">
        <div className="pf-panel-head mb-4">
          <h1 className="text-base font-semibold text-pf-ink ">
            {t("wallet.bill_title")}
          </h1>
        </div>
        <div className="pf-panel-body">
          <div
            role="radiogroup"
            aria-label={t("wallet.bill_title")}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {BILLERS.map((b) => (
              <RadioOption
                key={b.id}
                label={b.name}
                sublabel={b.category}
                selected={billerId === b.id}
                onSelect={() => setBillerId(b.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pf-panel p-5 ">
        <div className="pf-panel-head mb-4">
          <h2 className="text-base font-semibold text-pf-ink">
            {t("wallet.bill_subtitle")}
          </h2>
        </div>

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
            label={t("wallet.reference_label")}
            placeholder="Ex. 4471-208"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            error={fieldErrors.reference}
            disabled={isSubmitting}
          />
          <FormInput
            label={t("wallet.amount_label")}
            type="number"
            inputMode="numeric"
            placeholder="Ex. 8500"
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
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Receipt size={16} aria-hidden="true" />
            )}
            {isSubmitting ? t("common.loading") : t("wallet.btn_pay_bill")}
          </button>
        </form>
      </div>
    </div>
  );
}
