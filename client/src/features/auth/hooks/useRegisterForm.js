import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { validateRegisterForm, hasErrors } from "../utils/validators";

export function useRegisterForm() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", phone: "", pin: "", pinConfirmation: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setField = (key) => (value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setFormError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = validateRegisterForm(form);
        setFieldErrors(errors);
        if (hasErrors(errors)) return;

        setFormError("");
        setIsSubmitting(true);
        try {
            await register({ name: form.name, phone: form.phone, pin: form.pin });
            navigate("/dashboard");
        } catch (err) {
            setFormError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        setName: setField("name"),
        setPhone: setField("phone"),
        setPin: (v) => setField("pin")(v.replace(/\D/g, "")),
        setPinConfirmation: (v) => setField("pinConfirmation")(v.replace(/\D/g, "")),
        fieldErrors,
        formError,
        isSubmitting,
        handleSubmit,
    };
}