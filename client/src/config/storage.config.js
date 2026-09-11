/**
 * Registre immuable des clés de stockage utilisées dans le cycle de vie de PayFlow
 */
export const STORAGE_KEYS = {
    LANGUAGE: "payflow_lang",
    ACTIVE_SESSION: "payflow_session_profile",
    ACCESS_TOKEN: "payflow_jwt_access_token",
    REFRESH_TOKEN: "payflow_jwt_refresh_token",
    MOCK_USERS_DB: "payflow_mock_users_ledger",
    GLOBAL_TRANSACTIONS: "payflow_global_transactions_ledger",
    OPERATORS_STATE: "payflow_switch_operators_routing_state"
};
