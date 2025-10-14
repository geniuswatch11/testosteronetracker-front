"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { SpoResumePoint } from "@/lib/types/api"
import { format } from "date-fns"

interface Spo2ChartProps {
  data: SpoResumePoint[]
  startDate: string | null
  endDate: string | null
}

/**
 * Componente de gráfico de barras para SpO2
 * Muestra los niveles de saturación de oxígeno
 */
export function Spo2Chart({ data, startDate, endDate }: Spo2ChartProps) {
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
    const sum = filteredData.reduce((acc, point) => acc + point.spo2, 0)
    return sum / filteredData.length
  }, [filteredData])

  // Formatear datos para el gráfico
  const chartData = useMemo(() => {
    return filteredData.map((point) => {
      const date = new Date(point.date)
      return {
        time: format(date, "MMM d").toLowerCase(),
        value: point.spo2,
      }
    })
  }, [filteredData])

  return (
    <div className="bg-[#2A2A2A] rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white text-2xl font-bold">SpO₂</h3>
        <p className="text-neutral-400 text-sm">
          Avg: <span className="text-white font-bold">{average.toFixed(0)}%</span>
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
              domain={[0, 8]}
            />
            <Bar dataKey="value" fill="#DED854" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
