"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import type { RemResumePoint } from "@/lib/types/api"
import { format } from "date-fns"

interface RemChartProps {
  data: RemResumePoint[]
  startDate: string | null
  endDate: string | null
}

/**
 * Componente de gráfico de barras para REM
 * Muestra la duración del sueño REM con barras de colores según el objetivo
 */
export function RemChart({ data, startDate, endDate }: RemChartProps) {
  // Filtrar datos por rango de fechas o mostrar todos
  const filteredData = useMemo(() => {
    if (!startDate) return data
    if (!endDate) return data.filter((point) => point.date === startDate)
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    return data.filter((point) => {
      const date = new Date(point.date)
      return date >= start && date <= end
    })
  }, [data, startDate, endDate])

  // Calcular el promedio
  const average = useMemo(() => {
    if (filteredData.length === 0) return 0
    const sum = filteredData.reduce((acc, point) => acc + point.sleep_duration_rem, 0)
    return sum / filteredData.length
  }, [filteredData])

  // Objetivo de REM (2.1 horas = 70% de 3 horas máximo)
  const goalValue = 2.1
  const maxValue = 3

  // Calcular porcentaje del objetivo alcanzado
  const goalPercentage = useMemo(() => {
    return Math.round((average / maxValue) * 100)
  }, [average, maxValue])

  // Formatear datos para el gráfico
  const chartData = useMemo(() => {
    return filteredData.map((point) => {
      const date = new Date(point.date)
      return {
        time: format(date, "MMM d").toLowerCase(),
        value: point.sleep_duration_rem,
        isAboveGoal: point.sleep_duration_rem >= goalValue, // >= 2.1h es goal
        isPoor: point.sleep_duration_rem < goalValue, // < 2.1h es poor
      }
    })
  }, [filteredData, goalValue])

  return (
    <div className="bg-[#2A2A2A] rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white text-xl font-bold">REM</h3>
        <p className="text-neutral-400 text-sm">
          REM Avg: <span className="text-white font-bold">{average.toFixed(1)}h</span>
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#414141" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#8E8E8E"
              tick={{ fill: "#8E8E8E", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#8E8E8E"
              tick={{ fill: "#8E8E8E", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 3]}
              ticks={[0, 1, 2, 3]}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isAboveGoal ? "#22D3EE" : "#D94C4C"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-cyan-600" />
            <span className="text-neutral-400">Goals (at least 70% of this session is in normal hormonal state)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger-600" />
            <span className="text-neutral-400">Poor</span>
          </div>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="space-y-2">
        <p className="text-white text-sm font-medium">{goalPercentage}% of goal achieved</p>
        <div className="w-full bg-neutral-600 rounded-full h-2">
          <div
            className="bg-primary-cyan-600 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(goalPercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
