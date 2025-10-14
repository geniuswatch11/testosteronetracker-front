"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Globe } from "lucide-react"
import { useEffect, useState } from "react"
import type { Locale } from "@/lib/i18n/translations"
import { userApi } from "@/lib/api/user"
import { authApi } from "@/lib/api/auth"

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const formatDateToAPI = (dateStr: string | null): string => {
    if (!dateStr) return "";
    // Si ya está en formato YYYY-MM-DD, devolverlo tal cual
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    // Si es un objeto Date o string de fecha, convertirlo
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  const handleLanguageChange = async (newLanguage: Locale) => {
    // 1. Cambiar el idioma localmente primero para feedback inmediato
    setLocale(newLanguage)
    
    // 2. Guardar en el backend
    try {
      const userProfile = authApi.getCachedUserProfile()
      if (userProfile) {
        await userApi.updateProfile({
          username: userProfile.username || "",
          height: userProfile.height?.toString() || "",
          weight: userProfile.weight?.toString() || "",
          language: newLanguage,
          theme: userProfile.theme || "dark",
          birth_date: formatDateToAPI(userProfile.birth_date),
          gender: (userProfile.gender || "other") as "male" | "female" | "binary" | "other",
        })
        
        // Actualizar cache
        const updatedProfile = { ...userProfile, language: newLanguage }
        localStorage.setItem("user_profile", JSON.stringify(updatedProfile))
      }
    } catch (error) {
      console.error("Error updating language:", error)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-lg font-semibold">{t("settings.language")}</div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleLanguageChange("en")}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${
            locale === "en" 
              ? "border-neutral-500 bg-neutral-600" 
              : "border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
          }`}
        >
          <Globe className="h-5 w-5 mb-2" />
          <span className="text-sm">English</span>
        </button>
        <button
          type="button"
          onClick={() => handleLanguageChange("es")}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${
            locale === "es" 
              ? "border-neutral-500 bg-neutral-600" 
              : "border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
          }`}
        >
          <Globe className="h-5 w-5 mb-2" />
          <span className="text-sm">Español</span>
        </button>
      </div>
    </div>
  )
}
