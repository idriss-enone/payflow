import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "./useWallet";
import { validateAmount } from "../utils/validators";
import { CASH_CHANNELS } from "../data/mockChannels";

export function useWithdrawalForm() {
  const { balance, withdraw } = useWallet();
  const navigate = useNavigate();

  const [channelId, setChannelId] = useState(CASH_CHANNELS[0].id);
  const [amount, setAmount] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const channel = CASH_CHANNELS.find((c) => c.id === channelId);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = { amount: validateAmount(amount, { max: balance }) };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setFormError("");
    setIsSubmitting(true);
    try {
      await withdraw(Number(amount), channel.name);
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    channelId,
    setChannelId,
    amount,
    setAmount: (v) => { setAmount(v); setFormError(""); },
    fieldErrors,
    formError,
    isSubmitting,
    handleSubmit,
    balance,
  };
}