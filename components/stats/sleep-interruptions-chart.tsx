"use client"

import { useEffect, useState } from "react"
import { StatChart } from "./stat-chart"
import { metricsApi } from "@/lib/api/metrics"
import type { StatsDataPoint, ApiErrorResponse } from "@/lib/types/api"

/**
 * Componente para mostrar el gráfico de interrupciones del sueño
 * Consume el endpoint GET /stats/sleep-interruptions/
 */
export function SleepInterruptionsChart() {
  const [data, setData] = useState<StatsDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await metricsApi.getSleepInterruptionsStats()

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
        console.error("Error fetching sleep interruptions stats:", err)
        setError("Error al conectar con el servidor")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <StatChart
      title="Interrupciones del Sueño"
      data={data}
      isLoading={isLoading}
      error={error}
      color="#F49898"
      unit=""
    />
  )
}
