"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Activity, Moon, Heart } from "lucide-react"
import { InitializingLoader } from "@/components/dashboard/initializing-loader"
import { ConfigurationSetup } from "@/components/dashboard/configuration-setup"
import { PageHeader } from "@/components/layout/page-header"
import { EnergyLevelGauge } from "@/components/dashboard/energy-level-gauge"
import { MetricCard } from "@/components/dashboard/metric-card"
import { WeekFilter } from "@/components/dashboard/week-filter"
import { RemChart } from "@/components/dashboard/rem-chart"
import { SleepInterruptionsChart } from "@/components/dashboard/sleep-interruptions-chart"
import { Spo2Chart } from "@/components/dashboard/spo2-chart"
import { useAuth } from "@/hooks"
import { dashboardApi } from "@/lib/api/dashboard"
import type {
  EnergyLevelsResponse,
  BasicMetricsApiResponse,
  ApiErrorResponse,
} from "@/lib/types/api"

/**
 * Dashboard Page - Implementa Indirect Data Fetching Pattern
 * Usa el hook useAuth para manejar la autenticación y estado del usuario
 * Muestra los niveles de energía y métricas básicas del usuario
 */
export default function DashboardPage() {
  // Indirect Data Fetching: Toda la lógica de auth está en el hook
  const { isLoading, spikeConnected, isComplete } = useAuth()

  // Estados para manejar la llamada a la API
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [energyData, setEnergyData] = useState<EnergyLevelsResponse | null>(null)
  const [metricsData, setMetricsData] = useState<BasicMetricsApiResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)

  // Callback para manejar cambios en el rango de fechas
  const handleDateRangeChange = (start: string | null, end: string | null) => {
    setStartDate(start)
    setEndDate(end)
  }

  // Efecto para llamar a la API cuando el dispositivo está conectado y el perfil completo
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (spikeConnected && isComplete && !isLoading) {
        setIsLoadingData(true)
        setErrorMessage("")

        try {
          // Llamar a ambos endpoints en paralelo
          const [energyResponse, metricsResponse] = await Promise.all([
            dashboardApi.getEnergyLevels(),
            dashboardApi.getBasicMetrics(),
          ])

          // Verificar si hay errores
          if ("error" in energyResponse && energyResponse.error !== "") {
            const errorResponse = energyResponse as ApiErrorResponse
            setErrorMessage(errorResponse.message || "Error al obtener los niveles de energía")
          } else {
            setEnergyData(energyResponse as EnergyLevelsResponse)
          }

          if ("error" in metricsResponse && metricsResponse.error !== "") {
            const errorResponse = metricsResponse as ApiErrorResponse
            setErrorMessage(errorResponse.message || "Error al obtener las métricas básicas")
          } else {
            setMetricsData(metricsResponse as BasicMetricsApiResponse)
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error)
          setErrorMessage("Error al conectar con el servidor")
        } finally {
          setIsLoadingData(false)
        }
      }
    }

    fetchDashboardData()
  }, [spikeConnected, isComplete, isLoading])

  // Mostrar pantalla de inicialización
  if (isLoading || isLoadingData) {
    return <InitializingLoader />
  }

  // Si no están ambos completos, mostrar Configuration Setup
  if (!spikeConnected || !isComplete) {
    return <ConfigurationSetup spikeConnected={spikeConnected} isComplete={isComplete} />
  }

  // Si hay error, mostrar mensaje
  if (errorMessage) {
    return (
      <div className="min-h-screen bg-black px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <PageHeader />
          <div className="bg-danger-600 text-white p-4 rounded-lg">
            <p>{errorMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  // Si no hay datos, mostrar mensaje
  if (!energyData || !metricsData) {
    return (
      <div className="min-h-screen bg-black px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <PageHeader />
          <div className="bg-neutral-600 text-white p-4 rounded-lg">
            <p>No hay datos disponibles</p>
          </div>
        </div>
      </div>
    )
  }

  // Formatear la fecha de última actualización
  const lastUpdated = energyData.data.stats
    ? format(new Date(), "MMM dd, yyyy")
    : undefined

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <PageHeader />

        {/* Energy Level Gauge */}
        <EnergyLevelGauge stats={energyData.data.stats} lastUpdated={lastUpdated} />

        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            icon={Activity}
            value={`${metricsData.data.resume.sleep_efficiency.toFixed(0)}%`}
            label="Sleep Efficiency"
          />
          <MetricCard
            icon={Moon}
            value={`${metricsData.data.resume.sleep_duration.toFixed(1)}h`}
            label="Sleep Duration"
          />
          <MetricCard
            icon={Heart}
            value={`${metricsData.data.resume.hrv_rmssd.toFixed(0)}`}
            label="Hrv rmssd"
          />
        </div>

        {/* Disclaimer */}
        <p className="text-neutral-400 text-xs text-center">
          This is not a medical diagnosis. For accurate results, please consult your doctor or a certified laboratory.
        </p>

        {/* Data Records Section */}
        <WeekFilter
          dates={metricsData.data.dates}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
        />

        {/* Charts */}
        <div className="space-y-6">
          <RemChart data={metricsData.data.rem_resume} startDate={startDate} endDate={endDate} />
          <SleepInterruptionsChart data={metricsData.data.sleep_resume} startDate={startDate} endDate={endDate} />
          <Spo2Chart data={metricsData.data.spo_resume} startDate={startDate} endDate={endDate} />
        </div>
      </div>
    </div>
  )
}
