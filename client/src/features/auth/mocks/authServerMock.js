import MockAdapter from "axios-mock-adapter";
import storageUtil from "@/utils/storage.util";
import { STORAGE_KEYS } from "@/config/storage.config";
import { INITIAL_USERS_LEDGER } from "../data/mockData";
import { AUTH_DELAY, AUTH_ERRORS } from "../constants/auth.constants";

const sanitizePhone = (phone) => (phone || "").replace(/\D/g, "");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function ensureSeedUsers() {
    if (!storageUtil.get(STORAGE_KEYS.MOCK_USERS_DB)) {
        storageUtil.set(STORAGE_KEYS.MOCK_USERS_DB, INITIAL_USERS_LEDGER);
    }
}

function buildSession(user) {
    return {
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone, balance: user.balance },
        accessToken: `mock-jwt-access-token-${Math.random().toString(36).slice(2)}`,
        refreshToken: `mock-jwt-refresh-token-${Math.random().toString(36).slice(2)}`,
    };
}
/**
 * Branche un faux serveur sur l'instance axios donnée : mêmes règles,
 * même "base de données" (localStorage) qu'avant mais maintenant vues
 * comme de vraies routes HTTP (méthode, code de statut, corps JSON).
 * Le jour du vrai backend : ce fichier n'est plus importé nulle part, et
 * il faudra que le serveur implémente exactement ces trois routes.
 */
export function installAuthMock(httpClient) {
    ensureSeedUsers();
    // On branche axios-mock-adapter sur notre instance
    const mock = new MockAdapter(httpClient, { delayResponse: 500 }); // delay simule la latence réseau

    mock.onPost("/auth/login").reply(async (config) => {
        await delay(AUTH_DELAY.LOGIN);
        const { phone, pin } = JSON.parse(config.data);
        const users = storageUtil.get(STORAGE_KEYS.MOCK_USERS_DB) || [];
        const sanitizedPhone = sanitizePhone(phone);
        const user = users.find((u) => sanitizePhone(u.phone) === sanitizedPhone && u.pin === pin);

        if (!user) return [401, { message: AUTH_ERRORS.INVALID_CREDENTIALS }];
        return [200, buildSession(user)];
    });

    mock.onPost("/auth/register").reply(async (config) => {
        await delay(AUTH_DELAY.REGISTER);
        const { name, phone, pin } = JSON.parse(config.data);
        const users = storageUtil.get(STORAGE_KEYS.MOCK_USERS_DB) || [];
        const sanitizedPhone = sanitizePhone(phone);

        if (users.some((u) => sanitizePhone(u.phone) === sanitizedPhone)) {
            return [409, { message: AUTH_ERRORS.PHONE_ALREADY_EXISTS }];
        }

        const newUser = {
            id: `usr-${Math.random().toString(36).slice(2, 7)}`,
            name,
            email: `${name.toLowerCase().replace(/\s/g, "")}@payflow.cm`,
            phone,
            pin,
            balance: 0,
        };
        users.push(newUser);
        storageUtil.set(STORAGE_KEYS.MOCK_USERS_DB, users);

        return [201, buildSession(newUser)];
    });

    mock.onPost("/auth/logout").reply(async () => {
        await delay(AUTH_DELAY.LOGOUT);
        return [204];
    });

    // N'importe quelle autre requête non définie passera à travers (si besoin)
    mock.onAny().passThrough();

    return mock;
}