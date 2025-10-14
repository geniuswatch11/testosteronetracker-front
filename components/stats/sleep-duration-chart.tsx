"use client"

import { useEffect, useState } from "react"
import { StatChart } from "./stat-chart"
import { metricsApi } from "@/lib/api/metrics"
import type { StatsDataPoint, ApiErrorResponse } from "@/lib/types/api"

/**
 * Componente para mostrar el gráfico de duración del sueño
 * Consume el endpoint GET /stats/sleep-duration/
 */
export function SleepDurationChart() {
  const [data, setData] = useState<StatsDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await metricsApi.getSleepDurationStats()

        if ("error" in response && response.error !== "") {
          const errorResponse = response as ApiErrorResponse
          setError(errorResponse.message || "Error al cargar datos")
        } else {
          const newData = (response.data?.data || []) as StatsDataPoint[]
          if (newData.length > 0) {
            setData(newData)
          }
        }
      } catch (err) {
        console.error("Error fetching sleep duration stats:", err)
        setError("Error al conectar con el servidor")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <StatChart
      title="Duración del Sueño"
      data={data}
      isLoading={isLoading}
      error={error}
      color="#A3E635"
      unit=" hrs"
    />
  )
}
