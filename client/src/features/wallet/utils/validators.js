export function validateAmount(amount, { max } = {}) {
    const value = Number(amount);
    if (!amount || Number.isNaN(value) || value <= 0) return "wallet.error_invalid_amount";
    if (typeof max === "number" && value > max) return "wallet.insufficient_funds";
    return "";
}

export function validatePhoneRecipient(phone, ownPhone) {
    const digits = (phone || "").replace(/\D/g, "");
    if (digits.length < 8) return "auth.validation_phone_short";
    if (ownPhone && digits === ownPhone.replace(/\D/g, "")) return "wallet.error_self_transfer";
    return "";
}

export function validateReference(reference) {
    if (!reference || reference.trim().length < 2) return "wallet.error_reference_required";
    return "";
}