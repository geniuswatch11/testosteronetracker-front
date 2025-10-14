"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"
import type { SleepResumePoint } from "@/lib/types/api"
import { format } from "date-fns"

interface SleepInterruptionsChartProps {
  data: SleepResumePoint[]
  startDate: string | null
  endDate: string | null
}

/**
 * Componente de gráfico de líneas para Sleep Interruptions
 * Muestra las interrupciones del sueño con áreas destacadas
 */
export function SleepInterruptionsChart({ data, startDate, endDate }: SleepInterruptionsChartProps) {
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
    const sum = filteredData.reduce((acc, point) => acc + point.sleep_interruptions, 0)
    return sum / filteredData.length
  }, [filteredData])

  // Formatear datos para el gráfico
  const chartData = useMemo(() => {
    return filteredData.map((point) => {
      const date = new Date(point.date)
      return {
        time: format(date, "MMM d").toLowerCase(),
        interruptions: point.sleep_interruptions,
        efficiency: point.sleep_efficiency,
        duration: point.sleep_duration,
      }
    })
  }, [filteredData])

  // Calcular promedio de eficiencia y duración para el resumen
  const avgEfficiency = useMemo(() => {
    if (filteredData.length === 0) return 0
    const sum = filteredData.reduce((acc, point) => acc + point.sleep_efficiency, 0)
    return Math.round(sum / filteredData.length)
  }, [filteredData])

  const avgDuration = useMemo(() => {
    if (filteredData.length === 0) return 0
    const sum = filteredData.reduce((acc, point) => acc + point.sleep_duration, 0)
    return sum / filteredData.length
  }, [filteredData])

  const avgScore = useMemo(() => {
    if (filteredData.length === 0) return 0
    const sum = filteredData.reduce((acc, point) => acc + point.sleep_score, 0)
    return Math.round(sum / filteredData.length)
  }, [filteredData])

  return (
    <div className="bg-[#2A2A2A] rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white text-2xl font-bold">Sleep Interruptions</h3>
        <p className="text-neutral-400 text-sm">
          Avg: <span className="text-white font-bold">{Math.round(average)}</span>
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInterruptions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DED854" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#DED854" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="interruptions"
              stroke="#DED854"
              strokeWidth={3}
              fill="url(#colorInterruptions)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <h4 className="text-white text-xl font-bold">Summary</h4>
        <p className="text-neutral-400 text-sm">Sleep score and efficiency between interruption</p>

        <div className="flex items-center gap-6">
          {/* Gráfico circular de eficiencia */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#414141"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#D94C4C"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(avgEfficiency / 100) * 352} 352`}
                strokeLinecap="round"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#8E8E8E"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${((100 - avgEfficiency) / 100) * 352} 352`}
                strokeDashoffset={`-${(avgEfficiency / 100) * 352}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-neutral-400 text-xs">Duration</p>
              <p className="text-white text-xl font-bold">{avgDuration.toFixed(0)}h</p>
            </div>
          </div>

          {/* Detalles */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-danger-600" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Interruptions</p>
                <p className="text-neutral-400 text-xs">{Math.round(average)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-500" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Efficiency</p>
                <p className="text-neutral-400 text-xs">{avgEfficiency}%</p>
              </div>
            </div>
          </div>

          {/* Sleep Score */}
          <div className="border-2 border-dashed border-neutral-500 rounded-lg p-4 min-w-[120px]">
            <p className="text-white text-xl font-bold mb-1">Sleep score</p>
            <p className="text-white text-3xl font-bold">{avgScore}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
