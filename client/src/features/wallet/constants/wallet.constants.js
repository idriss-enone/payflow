export const TX_TYPE = {
    TRANSFER_OUT: "TRANSFER_OUT",
    TRANSFER_IN: "TRANSFER_IN",
    BILL: "BILL_PAYMENT",
    TOP_UP: "TOP_UP",
    WITHDRAWAL: "WITHDRAWAL",
};

export const TX_DIRECTION = {
    CREDIT: "CREDIT",
    DEBIT: "DEBIT",
};

export const TX_STATUS = {
    SUCCESS: "success",
    PENDING: "pending",
    FAILED: "failed",
    PROCESSING: "processing",
};

export const WALLET_DELAY = {
    READ: 400,
    TRANSFER: 900,
    BILL: 900,
    TOPUP: 700,
    WITHDRAWAL: 900,
};

export const WALLET_ERRORS = {
    INSUFFICIENT_FUNDS: "wallet.insufficient_funds",
    RECIPIENT_NOT_FOUND: "wallet.error_recipient_not_found",
    SELF_TRANSFER: "wallet.error_self_transfer",
    GENERIC: "common.error_generic",
};