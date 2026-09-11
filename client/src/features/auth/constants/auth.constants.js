export const AUTH_STATUS = {
    CHECKING: "CHECKING",
    AUTHENTICATED: "AUTHENTICATED",
    UNAUTHENTICATED: "UNAUTHENTICATED",
};

export const AUTH_ERRORS = {
    INVALID_CREDENTIALS: "auth.error_invalid_credentials",
    PHONE_ALREADY_EXISTS: "auth.error_phone_exists",
    INCOMPLETE_FIELDS: "auth.error_incomplete",
    PIN_MISMATCH: "auth.pin_mismatch_error",
};

export const AUTH_DELAY = {
    LOGIN: 1000,
    LOGOUT: 300,
    REGISTER: 1000,
};