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

  const handleLanguageChange = async (newLanguage: Locale) => {
    // 1. Cambiar el idioma localmente primero para feedback inmediato
    setLocale(newLanguage)
    
    // 2. Guardar en el backend (solo el campo language)
    try {
      await userApi.updateProfile({
        language: newLanguage,
      })
      
      // 3. Actualizar el cache del perfil de usuario
      const userProfile = authApi.getCachedUserProfile()
      if (userProfile) {
        const updatedProfile = { ...userProfile, language: newLanguage }
        localStorage.setItem("user_profile", JSON.stringify(updatedProfile))
      }
    } catch (error) {
      console.error("Error updating language:", error)
      // Si falla el backend, el cambio local ya se aplicó
      // La cookie/localStorage ya se actualizó en setLocale
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
