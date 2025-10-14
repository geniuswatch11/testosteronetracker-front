"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { userApi } from "@/lib/api/user"
import { authApi } from "@/lib/api/auth"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { t } = useLanguage()
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

  const handleThemeChange = async (newTheme: string) => {
    // 1. Cambiar el tema localmente primero para feedback inmediato
    setTheme(newTheme)
    
    // 2. Guardar en el backend
    try {
      const userProfile = authApi.getCachedUserProfile()
      if (userProfile) {
        await userApi.updateProfile({
          username: userProfile.username || "",
          height: userProfile.height?.toString() || "",
          weight: userProfile.weight?.toString() || "",
          language: userProfile.language || "en",
          theme: newTheme,
          birth_date: formatDateToAPI(userProfile.birth_date),
          gender: (userProfile.gender || "other") as "male" | "female" | "binary" | "other",
        })
        
        // Actualizar cache
        const updatedProfile = { ...userProfile, theme: newTheme }
        localStorage.setItem("user_profile", JSON.stringify(updatedProfile))
      }
    } catch (error) {
      console.error("Error updating theme:", error)
    }
  }

  if (!mounted) {
    return null
  }

  // Usar resolvedTheme para mostrar el botón activo correcto cuando el tema es "system"
  const displayTheme = theme === "system" ? "system" : resolvedTheme

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-lg font-semibold">{t("settings.theme")}</div>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handleThemeChange("light")}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${
            displayTheme === "light" && theme !== "system" 
              ? "border-neutral-500 bg-neutral-600" 
              : "border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
          }`}
        >
          <Sun className="h-5 w-5 mb-2" />
          <span className="text-sm">{t("settings.light")}</span>
        </button>
        <button
          type="button"
          onClick={() => handleThemeChange("dark")}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${
            displayTheme === "dark" && theme !== "system" 
              ? "border-neutral-500 bg-neutral-600" 
              : "border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
          }`}
        >
          <Moon className="h-5 w-5 mb-2" />
          <span className="text-sm">{t("settings.dark")}</span>
        </button>
        <button
          type="button"
          onClick={() => handleThemeChange("system")}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${
            theme === "system" 
              ? "border-neutral-500 bg-neutral-600" 
              : "border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
          }`}
        >
          <Monitor className="h-5 w-5 mb-2" />
          <span className="text-sm">{t("settings.system")}</span>
        </button>
      </div>
    </div>
  )
}
