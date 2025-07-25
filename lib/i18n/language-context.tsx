"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { translations, type Locale } from "./translations";
import { set } from "date-fns";

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (savedLocale && (savedLocale === "en" || savedLocale === "es")) {
      console.log("Saved locale from localStorage:", savedLocale);
      setLocale(savedLocale);
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    console.log("Changing locale to:", newLocale);
    if (newLocale !== "en" && newLocale !== "es") {
      setLocale("en");
    }
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value = translations[locale];

    for (const k of keys) {
      if (
        value &&
        typeof value === "object" &&
        k in value &&
        typeof (value as any)[k] === "object"
      ) {
        value = (value as any)[k];
      } else if (
        value &&
        typeof value === "object" &&
        k in value &&
        typeof (value as any)[k] === "string"
      ) {
        value = (value as any)[k];
      } else {
        return key; // Fallback to key if translation not found
      }
    }

    return typeof value === "string" ? value : key;
  };

  console.log("LanguageProvider initialized with locale:", locale);

  return (
    <LanguageContext.Provider value={{ locale, setLocale: changeLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
