"use client"

import { Suspense, useEffect, useState } from "react"
import SettingsForm from "@/components/settings/settings-form"
import { SettingsSkeleton } from "@/components/settings/settings-skeleton"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { userApi } from "@/lib/api/user"
import type { UserProfileData } from "@/lib/types/api"
import { InitializingLoader } from "@/components/dashboard/initializing-loader"
import { ConnectionError } from "@/components/dashboard/connection-error"
import { useTheme } from "next-themes"

function SettingsContent() {
  const searchParams = useSearchParams()
  const { t, setLocale } = useLanguage()
  const { setTheme } = useTheme()
  const [isInitializing, setIsInitializing] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null)
  const [avatars, setAvatars] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [themeInitialized, setThemeInitialized] = useState(false)

  const loadUserProfile = async (updateThemeAndLocale = false) => {
    try {
      const profile = await userApi.getUserProfile()
      setUserProfile(profile)
      
      // Solo actualizar tema e idioma en la carga inicial
      if (updateThemeAndLocale) {
        if (!themeInitialized) {
          setTheme(profile.theme || "system")
          setThemeInitialized(true)
        }
        setLocale(profile.language)
      }
      
      return profile
    } catch (error) {
      console.error("Error loading user profile:", error)
      throw error
    }
  }

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Intentar cargar avatares desde cache primero
        const cachedAvatars = localStorage.getItem("avatars_cache")
        const cacheTimestamp = localStorage.getItem("avatars_cache_timestamp")
        const now = Date.now()
        const ONE_DAY = 24 * 60 * 60 * 1000 // 1 día en milisegundos

        let avatarList: string[] = []

        // Si hay cache y no ha expirado (1 día), usarlo
        if (cachedAvatars && cacheTimestamp && (now - parseInt(cacheTimestamp)) < ONE_DAY) {
          avatarList = JSON.parse(cachedAvatars)
          setAvatars(avatarList)
        }

        // Cargar perfil y avatares (solo si no hay cache válido)
        const promises: Promise<any>[] = [loadUserProfile(true)] // true = actualizar tema e idioma
        
        if (avatarList.length === 0) {
          promises.push(userApi.getAvatars())
        }

        const results = await Promise.all(promises)
        
        if (results.length > 1) {
          avatarList = results[1]
          // Guardar avatares en cache
          localStorage.setItem("avatars_cache", JSON.stringify(avatarList))
          localStorage.setItem("avatars_cache_timestamp", now.toString())
          setAvatars(avatarList)
        }

      } catch (error) {
        console.error("Error loading settings data:", error)
        setError(t("errors.profileLoadError"))
      } finally {
        setIsInitializing(false)
        // Simular un pequeño retraso para una transición más suave
        setTimeout(() => setIsLoading(false), 300)
      }
    }

    loadInitialData()
  }, [setTheme, setLocale, t, themeInitialized])

  useEffect(() => {
    if (!isLoading && !error) {
      const section = searchParams.get("section")
      if (section === "personal-data") {
        const element = document.getElementById("personal-data")
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      } else if (section === "whoop") {
        const element = document.getElementById("whoop-connection")
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    }
  }, [searchParams, isLoading, error])

  // Mostrar pantalla de inicialización mientras se carga el perfil y se configura la app
  if (isInitializing) {
    return <InitializingLoader />
  }

  // Mostrar error si no se pudo cargar el perfil
  if (error) {
    return (
      <main className="container mx-auto max-w-md px-4 py-6">
        <ConnectionError message={error} />
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="container mx-auto max-w-md px-4 py-6">
        <SettingsSkeleton />
      </main>
    )
  }

  return (
    <main className="container mx-auto max-w-md px-4 py-6">
      {/* Eliminado el título duplicado */}
      <div className="mt-6">
        <SettingsForm 
          userProfile={userProfile} 
          avatars={avatars} 
          onProfileUpdated={loadUserProfile}
        />
      </div>
    </main>
  )
}

export default function SettingsClientPage() {
  return (
    <Suspense fallback={<InitializingLoader />}>
      <SettingsContent />
    </Suspense>
  )
}
