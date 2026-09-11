import storageUtil from "@/utils/storage.util";
import { STORAGE_KEYS } from "@/config/storage.config";

/**
 * Service de gestion d'état de la session utilisateur en cache local
 */
export const sessionService = {
    /**
     * Enregistre l'ensemble des données d'une session (User + Jetons cryptographiques)
     */
    save(session) {
        this.saveUser(session.user);
        this.saveAccessToken(session.accessToken);
        this.saveRefreshToken(session.refreshToken);
    },

    getUser() {
        return storageUtil.get(STORAGE_KEYS.ACTIVE_SESSION);
    },

    saveUser(user) {
        storageUtil.set(STORAGE_KEYS.ACTIVE_SESSION, user);
    },

    removeUser() {
        storageUtil.remove(STORAGE_KEYS.ACTIVE_SESSION);
    },

    getAccessToken() {
        return storageUtil.get(STORAGE_KEYS.ACCESS_TOKEN);
    },

    saveAccessToken(token) {
        storageUtil.set(STORAGE_KEYS.ACCESS_TOKEN, token);
    },

    removeAccessToken() {
        storageUtil.remove(STORAGE_KEYS.ACCESS_TOKEN);
    },

    getRefreshToken() {
        return storageUtil.get(STORAGE_KEYS.REFRESH_TOKEN);
    },

    saveRefreshToken(token) {
        storageUtil.set(STORAGE_KEYS.REFRESH_TOKEN, token);
    },

    removeRefreshToken() {
        storageUtil.remove(STORAGE_KEYS.REFRESH_TOKEN);
    },

    /**
     * Purge complète des données de l'agent (Révocation locale)
     */
    clearAuth() {
        this.removeUser();
        this.removeAccessToken();
        this.removeRefreshToken();
    }
};

export default sessionService;
