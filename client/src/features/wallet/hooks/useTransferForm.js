import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "./useWallet";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { validateAmount, validatePhoneRecipient } from "../utils/validators";

export function useTransferForm() {
    const { user } = useAuth();
    const { balance, transfer } = useWallet();
    const navigate = useNavigate();

    const [recipientPhone, setRecipientPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = {
            recipientPhone: validatePhoneRecipient(recipientPhone,user.phone),
            amount: validateAmount(amount, { max: balance }),
        };
        setFieldErrors(errors);
        if (Object.values(errors).some(Boolean)) return;

        setFormError("");
        setIsSubmitting(true);
        try {
            await transfer(recipientPhone, Number(amount), note);
            navigate("/dashboard");

        } catch (err) {
            setFormError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        recipientPhone,
        setRecipientPhone: (v) => { setRecipientPhone(v); setFormError(""); },
        amount,
        setAmount: (v) => { setAmount(v); setFormError(""); },
        note,
        setNote,
        fieldErrors,
        formError,
        isSubmitting,
        handleSubmit,
        balance,

    };
}