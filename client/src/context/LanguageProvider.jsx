import { useState, useEffect, useCallback, useMemo } from "react";
import LanguageContext from "./LanguageContext";
import storageUtil from "@/utils/storage.util";
import { STORAGE_KEYS } from "@/config/storage.config";
import fr from "@/config/i18n/fr.json";
import en from "@/config/i18n/en.json";

const DICTIONARIES = { fr, en };

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => storageUtil.get(STORAGE_KEYS.LANGUAGE) || "fr",
  );

  useEffect(() => {
    storageUtil.set(STORAGE_KEYS.LANGUAGE, lang);
  }, [lang]);

  const changeLanguage = useCallback((newLang) => {
    if (DICTIONARIES[newLang]) setLang(newLang);
  }, []);

  const t = useCallback(
    (path) => {
      const dictionary = DICTIONARIES[lang] || DICTIONARIES["fr"];
      const result = path
        .split(".")
        .reduce(
          (obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined),
          dictionary,
        );
      if (result === undefined && import.meta.env.DEV) {
        console.warn(`[i18n] Clé de traduction manquante : "${path}"`);
      }
      return result !== undefined ? result : path;
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, changeLanguage, t }),
    [lang, changeLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
