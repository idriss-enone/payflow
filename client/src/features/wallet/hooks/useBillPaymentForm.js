import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "./useWallet";
import { validateAmount, validateReference } from "../utils/validators";
import { BILLERS } from "../data/mockBillers";

export function useBillPaymentForm() {
  const { balance, payBill } = useWallet();
  const navigate = useNavigate();

  const [billerId, setBillerId] = useState(BILLERS[0].id);
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const biller = BILLERS.find((b) => b.id === billerId);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {
      reference: validateReference(reference),
      amount: validateAmount(amount, { max: balance }),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setFormError("");
    setIsSubmitting(true);
    try {
      await payBill(biller.name, reference, Number(amount));
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    billerId,
    setBillerId,
    reference,
    setReference: (v) => { setReference(v); setFormError(""); },
    amount,
    setAmount: (v) => { setAmount(v); setFormError(""); },
    fieldErrors,
    formError,
    isSubmitting,
    handleSubmit,
  };
}