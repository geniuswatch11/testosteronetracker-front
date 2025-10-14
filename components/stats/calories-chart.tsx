"use client"

import { useEffect, useState } from "react"
import { StatChart } from "./stat-chart"
import { metricsApi } from "@/lib/api/metrics"
import type { StatsDataPoint, ApiErrorResponse } from "@/lib/types/api"

/**
 * Componente para mostrar el gráfico de calorías
 * Consume el endpoint GET /stats/calories
 */
export function CaloriesChart() {
  const [data, setData] = useState<StatsDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await metricsApi.getCaloriesStats()

        if ("error" in response && response.error !== "") {
          const errorResponse = response as ApiErrorResponse
          setError(errorResponse.message || "Error al cargar datos")
        } else {
          const newData = (response.data?.data || []) as StatsDataPoint[]
          // Solo actualizar si hay datos nuevos (no es caché vacío)
          if (newData.length > 0) {
            setData(newData)
          }
          // Si es caché (array vacío), mantener datos previos
        }
      } catch (err) {
        console.error("Error fetching calories stats:", err)
        setError("Error al conectar con el servidor")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <StatChart
      title="Calorías"
      data={data}
      isLoading={isLoading}
      error={error}
      color="#DED854"
      unit=" cal"
    />
  )
}
