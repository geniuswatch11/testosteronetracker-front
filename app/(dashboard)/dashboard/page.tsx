"use client"

import { useEffect, useState } from "react"
import { InitializingLoader } from "@/components/dashboard/initializing-loader"
import { ConfigurationSetup } from "@/components/dashboard/configuration-setup"
import { WaitingForData } from "@/components/dashboard/waiting-for-data"
import { useAuth } from "@/hooks"
import { metricsApi } from "@/lib/api/metrics"
import type { BasicMetricsResponse, ApiErrorResponse } from "@/lib/types/api"

/**
 * Dashboard Page - Implementa Indirect Data Fetching Pattern
 * Usa el hook useAuth para manejar la autenticación y estado del usuario
 * Llama al endpoint /home/basic-metrics/ cuando el dispositivo está conectado
 */
export default function DashboardPage() {
  // Indirect Data Fetching: Toda la lógica de auth está en el hook
  const { isLoading, spikeConnected, isComplete } = useAuth()

  // Estados para manejar la llamada a la API
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false)
  const [metricsData, setMetricsData] = useState<BasicMetricsResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Efecto para llamar a la API cuando el dispositivo está conectado y el perfil completo
  useEffect(() => {
    const fetchBasicMetrics = async () => {
      if (spikeConnected && isComplete && !isLoading) {
        setIsLoadingMetrics(true)
        setErrorMessage("")
        setSuccessMessage("")

        try {
          const response = await metricsApi.getBasicMetrics()

          // Verificar si es una respuesta de error
          if ("error" in response && response.error !== "") {
            const errorResponse = response as ApiErrorResponse
            setErrorMessage(errorResponse.message || "Error al obtener los datos")
          } else {
            // Es una respuesta exitosa
            const successResponse = response as BasicMetricsResponse
            setMetricsData(successResponse)
            setSuccessMessage("Datos obtenidos correctamente")
          }
        } catch (error) {
          console.error("Error fetching basic metrics:", error)
          setErrorMessage("Error al conectar con el servidor")
        } finally {
          setIsLoadingMetrics(false)
        }
      }
    }

    fetchBasicMetrics()
  }, [spikeConnected, isComplete, isLoading])

  // Mostrar pantalla de inicialización
  if (isLoading || isLoadingMetrics) {
    return <InitializingLoader />
  }

  // Si ambos SPIKE_CONNECT_KEY y is_complete son true, mostrar WaitingForData
  if (spikeConnected && isComplete) {
    return (
      <WaitingForData
        message={successMessage || "Sin datos"}
        errorMessage={errorMessage}
      />
    )
  }

  // Si no están ambos completos, mostrar Configuration Setup
  return <ConfigurationSetup spikeConnected={spikeConnected} isComplete={isComplete} />
}
