"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { InitializingLoader } from "@/components/dashboard/initializing-loader"
import { ConfigurationSetup } from "@/components/dashboard/configuration-setup"
import { ComingSoon } from "@/components/ui/coming-soon"
import { authApi } from "@/lib/api/auth"
import { useLanguage } from "@/lib/i18n/language-context"

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isInitializing, setIsInitializing] = useState(true)
  const [spikeConnected, setSpikeConnected] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Efecto para cargar los valores de localStorage/cookies
  useEffect(() => {
    const initializeApp = () => {
      // Verificación adicional de autenticación
      if (!authApi.isAuthenticated()) {
        router.replace("/login")
        return
      }

      // Obtener valores de SPIKE_CONNECT_KEY y is_complete directamente de localStorage/cookies
      const spikeConnect = authApi.getSpikeConnect()
      const complete = authApi.getIsComplete()
      setSpikeConnected(spikeConnect)
      setIsComplete(complete)

      // Finalizar la inicialización
      setIsInitializing(false)
    }

    initializeApp()
  }, [router])

  // Mostrar pantalla de inicialización
  if (isInitializing) {
    return <InitializingLoader />
  }

  // Si ambos SPIKE_CONNECT_KEY y is_complete son true, mostrar Coming Soon
  if (spikeConnected && isComplete) {
    return (
      <ComingSoon
        title="Coming Soon"
        description="Dashboard functionality will be available soon"
        buttonText={t("common.back")}
        showButton={false}
      />
    )
  }

  // Si no están ambos completos, mostrar Configuration Setup
  return <ConfigurationSetup spikeConnected={spikeConnected} isComplete={isComplete} />
}
