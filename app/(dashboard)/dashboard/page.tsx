"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import ProfileStepper from "@/components/dashboard/profile-stepper"
import TestosteroneChart from "@/components/dashboard/testosterone-chart"
import TestosteroneTable from "@/components/dashboard/testosterone-table"
import HealthStats from "@/components/dashboard/health-stats"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { InitializingLoader } from "@/components/dashboard/initializing-loader"
import { ConnectionError } from "@/components/dashboard/connection-error"
import LabTestModal from "@/components/dashboard/lab-test-modal"
import { healthApi, type HealthData } from "@/lib/api/health"
import { authApi, type UserProfile } from "@/lib/api/auth"
import { useLanguage } from "@/lib/i18n/language-context"
import TestosteroneValue from "@/components/dashboard/testosterone-value"

export default function DashboardPage() {
  const router = useRouter()
  const { t, setLocale } = useLanguage()
  const { setTheme } = useTheme()
  const [healthData, setHealthData] = useState<HealthData[]>([])
  const [isInitializing, setIsInitializing] = useState(true) // Estado para la inicialización completa
  const [isInitialLoading, setIsInitialLoading] = useState(true) // Carga inicial de la página
  const [isDataLoading, setIsDataLoading] = useState(false) // Carga de datos específicamente
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [profileComplete, setProfileComplete] = useState(false)
  const [selectedInterval, setSelectedInterval] = useState(1) // Día por defecto
  const [error, setError] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [themeInitialized, setThemeInitialized] = useState(false)
  const [isLabModalOpen, setIsLabModalOpen] = useState(false)

  // Definir los intervalos disponibles
  const intervals = [
    { label: t("charts.intervals.day"), value: 1 },
    { label: t("charts.intervals.week"), value: 7 },
    { label: t("charts.intervals.month"), value: 30 },
  ]

  // Efecto para cargar el perfil del usuario y configurar la aplicación
  useEffect(() => {
    const initializeApp = async () => {
      // Verificación adicional de autenticación
      if (!authApi.isAuthenticated()) {
        router.replace("/login")
        return
      }

      try {
        // Obtener el perfil del usuario
        const profile = await authApi.getUserProfile()
        setUserProfile(profile)

        // Configurar el tema según las preferencias del usuario
        // Only set theme once during initialization
        if (!themeInitialized) {
          if (profile.theme === "white") {
            setTheme("light")
          } else if (profile.theme === "dark") {
            setTheme("dark")
          } else {
            setTheme("system")
          }
          setThemeInitialized(true)
        }

        // Configurar el idioma según las preferencias del usuario
        setLocale(profile.lenguaje)

        // Verificar si el perfil está completo
        const isComplete = authApi.isProfileComplete(profile)
        setProfileComplete(isComplete)

        // Si el perfil está completo, cargar los datos de salud
        if (isComplete) {
          await fetchHealthData()
        }

        // Finalizar la inicialización
        setIsInitializing(false)

        // Después de un breve retraso, mostrar la interfaz
        setTimeout(() => {
          setIsInitialLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error initializing app:", error)
        setProfileError(t("errors.profileLoadError"))
        setIsInitializing(false)
        setIsInitialLoading(false)
      }
    }

    initializeApp()
  }, [router, setTheme, setLocale, t, themeInitialized])

  // Efecto para actualizar datos cuando cambia el intervalo
  useEffect(() => {
    // No cargar datos durante la carga inicial o si el perfil no está completo
    if (!isInitialLoading && !isInitializing && profileComplete && healthData.length > 0) {
      fetchHealthData()
    }
  }, [selectedInterval, profileComplete])

  // Función para cargar datos de salud
  const fetchHealthData = async () => {
    setIsDataLoading(true)
    setError(null)
    try {
      const response = await healthApi.getUserHealthData(selectedInterval, 12)
      if (response.status === "complete" && response.data) {
        setHealthData(response.data)
      }
    } catch (error) {
      console.error("Error fetching health data:", error)
      setError(t("errors.connectionMessage"))
    } finally {
      setIsDataLoading(false)
    }
  }

  // Función para cambiar el intervalo seleccionado
  const handleIntervalChange = (interval: number) => {
    setSelectedInterval(interval)
  }

  // Mostrar pantalla de inicialización mientras se carga el perfil y se configura la app
  if (isInitializing) {
    return <InitializingLoader />
  }

  // Mostrar error si no se pudo cargar el perfil
  if (profileError) {
    return (
      <main className="container mx-auto max-w-md px-4 py-6">
        <ConnectionError message={profileError} />
      </main>
    )
  }

  // Mostrar esqueleto durante la carga inicial
  if (isInitialLoading) {
    return (
      <main className="container mx-auto max-w-md px-4 py-6">
        <DashboardSkeleton />
      </main>
    )
  }

  // Verificar si hay datos de testosterona
  const hasTestosteroneData = healthData.length > 0 && healthData.some((item) => item.testosterone !== null)
  const latestData = healthData.length > 0 ? healthData[0] : null // El primer elemento es el más reciente

  return (
    <main className="container mx-auto max-w-md px-4 py-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">{t("dashboard.overview")}</h1>

      {!profileComplete && (
        <div className="mt-8 mb-12">
          <ProfileStepper
            hasWhoop={userProfile?.has_client_id || false}
            hasPersonalData={!!(userProfile?.birth_date && userProfile?.height && userProfile?.weight)}
          />
        </div>
      )}

      {/* Mostrar error de conexión si hay un error */}
      {error && <ConnectionError message={error} />}

      {!error && profileComplete && (healthData.length > 0 || isDataLoading) ? (
        <>
          <div className="text-center space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">{t("dashboard.currentTestosterone")}</div>
              <TestosteroneValue
                value={latestData?.testosterone || null}
                birthDate={userProfile?.birth_date || null}
                isLoading={isDataLoading}
              />
            </div>
            <button
              onClick={() => setIsLabModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <span>{t("dashboard.labTest")}</span>
            </button>
          </div>

          <TestosteroneChart
            initialData={healthData}
            intervals={intervals}
            selectedInterval={selectedInterval}
            onIntervalChange={handleIntervalChange}
            isLoading={isDataLoading}
          />

          <TestosteroneTable
            birthDate={userProfile?.birth_date || null}
            testosteroneValue={latestData?.testosterone || null}
            isLoading={isDataLoading}
          />

          <HealthStats
            initialData={healthData}
            intervals={intervals}
            selectedInterval={selectedInterval}
            onIntervalChange={handleIntervalChange}
            isLoading={isDataLoading}
          />
        </>
      ) : !error && profileComplete ? (
        <div className="text-center text-muted-foreground">{t("dashboard.loadingHealthData")}</div>
      ) : !error ? (
        <div className="text-center text-muted-foreground">{t("dashboard.completeProfileToSee")}</div>
      ) : null}

      {/* Modal de laboratorios */}
      <LabTestModal isOpen={isLabModalOpen} onClose={() => setIsLabModalOpen(false)} />
    </main>
  )
}
