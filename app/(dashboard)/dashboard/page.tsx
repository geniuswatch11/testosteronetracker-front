"use client"

import { InitializingLoader } from "@/components/dashboard/initializing-loader"
import { ConfigurationSetup } from "@/components/dashboard/configuration-setup"
import { ComingSoon } from "@/components/ui/coming-soon"
import { useAuth } from "@/hooks"
import { useLanguage } from "@/lib/i18n/language-context"

/**
 * Dashboard Page - Implementa Indirect Data Fetching Pattern
 * Usa el hook useAuth para manejar la autenticación y estado del usuario
 */
export default function DashboardPage() {
  const { t } = useLanguage()
  
  // Indirect Data Fetching: Toda la lógica de auth está en el hook
  const { isLoading, spikeConnected, isComplete } = useAuth()

  // Mostrar pantalla de inicialización
  if (isLoading) {
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
