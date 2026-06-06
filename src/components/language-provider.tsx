"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  DEFAULT_LANGUAGE,
  isLanguage,
  translations,
  type Language,
  type Translation
} from "@/lib/i18n";
import type { ReactNode } from "react";

type LanguageContextValue = {
  language: Language;
  direction: "rtl" | "ltr";
  t: Translation;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const LANGUAGE_STORAGE_KEY = "site-language";

function getUrlLanguage(): Language | null {
  if (typeof window === "undefined") {
    return null;
  }

  const language = new URLSearchParams(window.location.search).get("lang");
  return isLanguage(language) ? language : null;
}

function storeUrlLanguage(language: Language) {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  if (language === DEFAULT_LANGUAGE) {
    url.searchParams.delete("lang");
  } else {
    url.searchParams.set("lang", language);
  }
  window.history.replaceState(null, "", url);
}

function getWindowNameLanguage(): Language | null {
  if (typeof window === "undefined" || typeof window.name !== "string") {
    return null;
  }

  const match = window.name.match(/(?:^|;)site-language=(he|en)(?:;|$)/);
  return isLanguage(match?.[1]) ? match[1] : null;
}

function storeWindowNameLanguage(language: Language) {
  if (typeof window === "undefined") {
    return;
  }

  const parts = typeof window.name === "string" ? window.name.split(";") : [];
  const preservedParts = parts.filter((part) => !part.startsWith("site-language="));
  preservedParts.push(`site-language=${language}`);
  window.name = preservedParts.filter(Boolean).join(";");
}

function getCookieLanguage(): Language | null {
  if (typeof document === "undefined" || typeof document.cookie !== "string") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LANGUAGE_STORAGE_KEY}=`));
  if (!cookie) {
    return null;
  }

  const value = decodeURIComponent(cookie.split("=")[1] ?? "");
  return isLanguage(value) ? value : null;
}

function getLocalStorageLanguage(): Language | null {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return null;
  }

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(storedLanguage) ? storedLanguage : null;
  } catch {
    return null;
  }
}

function storeLanguage(language: Language) {
  if (typeof window !== "undefined" && "localStorage" in window) {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Some embedded browsers restrict localStorage; the cookie keeps the UI persistent.
    }
  }

  if (typeof document !== "undefined") {
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${encodeURIComponent(
      language
    )}; path=/; max-age=31536000; SameSite=Lax`;
  }

  storeWindowNameLanguage(language);
  storeUrlLanguage(language);
}

function getStoredLanguage(): Language {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  return (
    getUrlLanguage() ??
    getLocalStorageLanguage() ??
    getCookieLanguage() ??
    getWindowNameLanguage() ??
    DEFAULT_LANGUAGE
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [hasLoadedPreferredLanguage, setHasLoadedPreferredLanguage] = useState(false);

  useEffect(() => {
    setLanguageState(getStoredLanguage());
    setHasLoadedPreferredLanguage(true);
  }, []);

  const direction = language === "he" ? "rtl" : "ltr";
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.body.dataset.language = language;
    document.title = t.meta.title;
    if (hasLoadedPreferredLanguage) {
      storeLanguage(language);
    }
  }, [direction, hasLoadedPreferredLanguage, language, t.meta.title]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      direction,
      t,
      setLanguage: (nextLanguage) => {
        storeLanguage(nextLanguage);
        setLanguageState(nextLanguage);
      }
    }),
    [direction, language, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider.");
  }
  return context;
}
