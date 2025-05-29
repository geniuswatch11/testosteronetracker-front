"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { authApi } from "@/lib/api/auth"
import { apiRequest } from "@/lib/api/api-client"

interface ThemeToggleProps {
  initialTheme?: string
}

export function ThemeToggle({ initialTheme }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  // Establecer el tema inicial cuando el componente se monta
  useEffect(() => {
    if (initialTheme && !mounted && !isChanging) {
      setTheme(initialTheme)
    }
  }, [initialTheme, setTheme, mounted, isChanging])

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const updateThemeInBackend = async (newTheme: string) => {
    const token = authApi.getToken()
    const userProfile = authApi.getCachedUserProfile()

    if (!token || !userProfile || !userProfile.id) {
      console.error("Cannot update theme: missing token or user profile")
      return
    }

    try {
      // Convert theme format for backend
      const backendTheme = newTheme === "light" ? "white" : newTheme

      const response = await apiRequest("https://api.geniushpro.com/update-record", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          table: "users",
          data: {
            theme: backendTheme,
          },
          where: {
            id: userProfile.id,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Error updating theme: ${response.status}`)
      }
    } catch (error) {
      console.error("Error updating theme:", error)
      throw error
    }
  }

  const handleThemeChange = async (newTheme: string) => {
    if (isChanging) return // Prevent multiple rapid changes

    setIsChanging(true)

    try {
      // 1. Change theme locally first
      setTheme(newTheme)

      // 2. Update cached profile immediately to prevent flickering
      const userProfile = authApi.getCachedUserProfile()
      if (userProfile) {
        // Convert theme format for backend
        const backendTheme = newTheme === "light" ? "white" : newTheme
        const updatedProfile = {
          ...userProfile,
          theme: backendTheme,
        }
        localStorage.setItem("user_profile", JSON.stringify(updatedProfile))
      }

      // 3. Make the API request
      await updateThemeInBackend(newTheme)
    } catch (error) {
      console.error("Failed to update theme:", error)
    } finally {
      setIsChanging(false)
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
          onClick={() => handleThemeChange("light")}
          disabled={isChanging}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
            displayTheme === "light" && theme !== "system" ? "border-primary bg-muted" : "border-muted"
          } ${isChanging ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Sun className="h-5 w-5 mb-2" />
          <span className="text-sm">{t("settings.light")}</span>
        </button>
        <button
          onClick={() => handleThemeChange("dark")}
          disabled={isChanging}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
            displayTheme === "dark" && theme !== "system" ? "border-primary bg-muted" : "border-muted"
          } ${isChanging ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Moon className="h-5 w-5 mb-2" />
          <span className="text-sm">{t("settings.dark")}</span>
        </button>
        <button
          onClick={() => handleThemeChange("system")}
          disabled={isChanging}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
            theme === "system" ? "border-primary bg-muted" : "border-muted"
          } ${isChanging ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Monitor className="h-5 w-5 mb-2" />
          <span className="text-sm">{t("settings.system")}</span>
        </button>
      </div>
    </div>
  )
}
