import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { validateLoginForm, hasErrors } from "../utils/validators";

// Porte tout ce qui n'est pas du rendu : champs, erreurs par champ, erreur
// globale, et soumission. La vue n'a plus qu'à afficher ce que ce hook expose.
export function useLoginForm() {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFormError = () => setFormError("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateLoginForm({ phone, pin });
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    setFormError("");
    setIsSubmitting(true);
    try {
      await login(phone, pin);
      navigate("/dashboard");
    } catch (err) {
      console.log(t(err.message))
      setFormError(t(err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    phone,
    setPhone: (v) => { setPhone(v); clearFormError(); },
    pin,
    setPin: (v) => { setPin(v.replace(/\D/g, "")); clearFormError(); },
    fieldErrors,
    formError,
    isSubmitting,
    handleSubmit,
  };
}