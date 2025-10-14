"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { metricsApi } from "@/lib/api/metrics"
import type { CaloriesDataPoint, ApiErrorResponse } from "@/lib/types/api"

interface CaloriesBurnedChartProps {
  period: string // "1w", "2w", "3w", "4w"
}

/**
 * Componente para mostrar el gráfico de calorías quemadas
 * Diseño: Gráfico de barras naranja según las imágenes
 * Filtra datos según el período seleccionado
 */
export function CaloriesBurnedChart({ period }: CaloriesBurnedChartProps) {
  const [data, setData] = useState<CaloriesDataPoint[]>([])
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
          const newData = (response.data || []) as CaloriesDataPoint[]
          if (newData.length > 0) {
            setData(newData)
          }
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

  if (isLoading) {
    return (
      <div className="bg-neutral-600 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Calories Burned</h3>
          <InfoTooltip description="Track your daily calories burned through activities and exercise. Higher values indicate more active days." />
        </div>
        <div className="h-48 flex items-center justify-center">
          <div className="text-neutral-400">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-neutral-600 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Calories Burned</h3>
          <InfoTooltip description="Track your daily calories burned through activities and exercise. Higher values indicate more active days." />
        </div>
        <div className="h-48 flex items-center justify-center">
          <div className="text-danger-400 text-center text-sm">{error}</div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-neutral-600 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Calories Burned</h3>
          <InfoTooltip description="Track your daily calories burned through activities and exercise. Higher values indicate more active days." />
        </div>
        <div className="h-48 flex items-center justify-center">
          <div className="text-neutral-400 text-center text-sm">No data available</div>
        </div>
      </div>
    )
  }

  // Filtrar datos según el período seleccionado
  const getFilteredData = () => {
    const weeks = parseInt(period.replace("w", ""))
    const daysToShow = weeks * 7
    
    // Ordenar por day_index descendente y tomar los últimos N días
    const sortedData = [...data].sort((a, b) => b.day_index - a.day_index)
    return sortedData.slice(0, daysToShow).reverse()
  }

  const filteredData = getFilteredData()

  // Formatear datos para el gráfico - mostrar días en lugar de horas
  const chartData = filteredData.map((item) => {
    const date = new Date(item.date)
    const day = date.getDate()
    const month = date.toLocaleDateString("en-US", { month: "short" })
    return {
      time: `${day} ${month}`,
      value: item.calories_burned,
    }
  })

  return (
    <div className="bg-neutral-600 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">Calories Burned</h3>
        <InfoTooltip description="Track your daily calories burned through activities and exercise. Higher values indicate more active days." />
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} barCategoryGap="20%" barGap={2}>
          <XAxis
            dataKey="time"
            stroke="#8E8E8E"
            tick={{ fill: "#8E8E8E", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={[0, "auto"]} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={12}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#FF6B35" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
