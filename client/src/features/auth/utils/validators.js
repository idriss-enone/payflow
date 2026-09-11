
export function validatePhone(phone) {
    const digits = (phone || "").replace(/\D/g, "");
    if (digits.length < 9) return "auth.validation_phone_short";
    return "";
}

export function validatePin(pin) {
    if (!/^\d{4}$/.test(pin || "")) return "auth.validation_pin_format";
    return "";
}

export function validateName(name) {
    if (!name || name.trim().length < 2) return "auth.validation_name_short";
    return "";
}

export function validatePinMatch(pin, confirmation) {
    if (pin !== confirmation) return "auth.pin_mismatch_error";
    return "";
}

export function validateLoginForm({ phone, pin }) {
    return {
        phone: validatePhone(phone),
        pin: validatePin(pin),
    };
}

export function validateRegisterForm({ name, phone, pin, pinConfirmation }) {
    const pinError = validatePin(pin);
    return {
        name: validateName(name),
        phone: validatePhone(phone),
        pin: pinError,
        // Inutile de signaler un désaccord si le PIN lui-même est déjà invalide.
        pinConfirmation: pinError ? "" : validatePinMatch(pin, pinConfirmation),
    };
}

export function hasErrors(errors) {
    return Object.values(errors).some(Boolean);
}