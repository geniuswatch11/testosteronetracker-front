"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { StatsDataPoint } from "@/lib/types/api"

interface StatChartProps {
  title: string
  data: StatsDataPoint[]
  isLoading: boolean
  error: string | null
  color?: string
  unit?: string
}

/**
 * Componente base reutilizable para mostrar gráficos de estadísticas
 */
export function StatChart({ title, data, isLoading, error, color = "#DED854", unit = "" }: StatChartProps) {
  if (isLoading) {
    return (
      <div className="rounded-3xl bg-neutral-600 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-neutral-400">Cargando datos...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-neutral-600 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-danger-400 text-center">
            <p className="font-semibold mb-2">Error al cargar datos</p>
            <p className="text-sm text-neutral-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl bg-neutral-600 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-neutral-400 text-center">
            <p>No hay datos disponibles</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-neutral-600 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#414141" />
          <XAxis
            dataKey="date"
            stroke="#8E8E8E"
            tick={{ fill: "#8E8E8E" }}
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getMonth() + 1}/${date.getDate()}`
            }}
          />
          <YAxis
            stroke="#8E8E8E"
            tick={{ fill: "#8E8E8E" }}
            tickFormatter={(value) => `${value}${unit}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#414141",
              border: "1px solid #8E8E8E",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#FFFFFF" }}
            itemStyle={{ color: color }}
            formatter={(value: number) => [`${value}${unit}`, title]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
