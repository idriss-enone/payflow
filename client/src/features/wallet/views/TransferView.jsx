import { useTranslation } from "@/hooks/useTranslation";
import { useTransferForm } from "../hooks/useTransferForm";
import FormInput from "@/components/FormInput";
import { formatXAF } from "../utils/format";
import { Send, Loader2 } from "lucide-react";

export default function TransferView() {
  const { t } = useTranslation();
  const {
    recipientPhone,
    setRecipientPhone,
    amount,
    setAmount,
    note,
    setNote,
    fieldErrors,
    formError,
    isSubmitting,
    handleSubmit,
    balance,
  } = useTransferForm();

  return (
    <div className="pf-panel p-5 animate-fade-in">
      <div className="pf-panel-head mb-5">
        <h1 className="text-base font-semibold text-pf-ink mb-1">
          {t("wallet.transfer_title")}
        </h1>
        <p className="text-xs text-pf-ink-faint">
          {t("wallet.balance_label")} : {formatXAF(balance)}
        </p>
      </div>

      <div className="pf-panel-body">
        {formError && (
          <div
            role="alert"
            className="p-3 mb-4 text-xs font-semibold border rounded-lg bg-pf-coral-dim text-pf-coral border-pf-coral/15 leading-relaxed"
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
            id="recipientPhone"
            label={t("wallet.recipient_phone")}
            placeholder="Ex. 670000002"
            value={recipientPhone}
            onChange={(e) => setRecipientPhone(e.target.value)}
            error={fieldErrors.recipientPhone}
            disabled={isSubmitting}
            required
          />
          <FormInput
            id="amount"
            label={t("wallet.amount")}
            type="number"
            inputMode="numeric"
            placeholder="Ex. 10000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={fieldErrors.amount}
            disabled={isSubmitting}
            required
          />
          <FormInput
            id="note"
            label={t("wallet.note_optional")}
            placeholder="Ex. Pour le loyer"
            value={note}
            onChange={(e) => setNote(e.target.value)}
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
              <Send size={16} aria-hidden="true" />
            )}
            {isSubmitting ? t("common.loading") : t("wallet.btn_transfer")}
          </button>
        </form>
      </div>
    </div>
  );
}
