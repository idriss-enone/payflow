export const TX_KIND = {
    TRANSFER_OUT: "transfer_out",
    TRANSFER_IN: "transfer_in",
    BILL: "bill",
    TOPUP: "topup",
    WITHDRAWAL: "withdrawal",
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

// Une transaction peut échouer même après que la validation ait réussi —
// comme un vrai réseau mobile money qui timeout ou refuse ponctuellement.
// 30% pour que tu voies un échec facilement en testant seulement 4 envois.
export const TRANSFER_FAILURE_RATE = 0.3;

export const WALLET_ERRORS = {
    INSUFFICIENT_FUNDS: "wallet.insufficient_funds",
    RECIPIENT_NOT_FOUND: "wallet.error_recipient_not_found",
    SELF_TRANSFER: "wallet.error_self_transfer",
    GENERIC: "common.error_generic",
};


