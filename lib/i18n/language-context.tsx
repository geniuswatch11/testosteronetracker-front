"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import Cookies from "js-cookie"
import { translations, type Locale } from "./translations"

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Inicializar con el valor de la cookie/localStorage si existe
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const cookieLocale = Cookies.get("locale") as Locale | undefined
      const savedLocale = localStorage.getItem("locale") as Locale | null
      const finalLocale = cookieLocale || savedLocale
      
      if (finalLocale && (finalLocale === "en" || finalLocale === "es")) {
        return finalLocale
      }
    }
    return "en"
  })

  const changeLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
    Cookies.set("locale", newLocale, { expires: 365 })
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let value = translations[locale]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k as keyof typeof value]
      } else {
        return key // Fallback to key if translation not found
      }
    }

    return value as string
  }

  return <LanguageContext.Provider value={{ locale, setLocale: changeLocale, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
