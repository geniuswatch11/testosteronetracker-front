"use client"

import { useMemo } from "react"
import type { EnergyLevelStats } from "@/lib/types/api"

interface EnergyLevelGaugeProps {
  stats: EnergyLevelStats
  lastUpdated?: string
}

/**
 * Componente de gráfico circular para mostrar los niveles de energía/testosterona
 * Usa SVG nativo para crear un gauge circular con múltiples anillos y marcas
 */
export function EnergyLevelGauge({ stats, lastUpdated }: EnergyLevelGaugeProps) {
  // Calcular el porcentaje de cambio de tendencia
  const trendChange = useMemo(() => {
    if (stats.average_level === 0) return 0
    return ((stats.current_level - stats.average_level) / stats.average_level) * 100
  }, [stats.current_level, stats.average_level])

  // Datos para los anillos del gauge
  const gaugeData = useMemo(() => {
    // Normalizar los valores a un rango de 0-360 grados
    const maxValue = 1000 // Valor máximo esperado en ng/dL
    const currentDegrees = (stats.current_level / maxValue) * 360
    const highestDegrees = (stats.highest_level / maxValue) * 360
    const averageDegrees = (stats.average_level / maxValue) * 360
    const lowestDegrees = (stats.lowest_level / maxValue) * 360

    return {
      current: currentDegrees,
      highest: highestDegrees,
      average: averageDegrees,
      lowest: lowestDegrees,
    }
  }, [stats])

  // Función para crear el path del arco
  const createArc = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const start = polarToCartesian(150, 150, outerRadius, endAngle)
    const end = polarToCartesian(150, 150, outerRadius, startAngle)
    const innerStart = polarToCartesian(150, 150, innerRadius, endAngle)
    const innerEnd = polarToCartesian(150, 150, innerRadius, startAngle)
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    
    return [
      "M", start.x, start.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ")
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  // Crear marcas alrededor del gauge
  const ticks = useMemo(() => {
    const tickCount = 40
    const tickArray = []
    for (let i = 0; i < tickCount; i++) {
      const angle = (i / tickCount) * 360
      const isHighlight = i % 5 === 0
      const outerRadius = 145
      const innerRadius = isHighlight ? 135 : 138
      const start = polarToCartesian(150, 150, outerRadius, angle)
      const end = polarToCartesian(150, 150, innerRadius, angle)
      
      tickArray.push({
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        isHighlight,
      })
    }
    return tickArray
  }, [])

  return (
    <div className="bg-[#2A2A2A] rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-bold">Testosterone Estimate</h2>
        {lastUpdated && (
          <p className="text-neutral-400 text-xs">Last updated: {lastUpdated}</p>
        )}
      </div>

      {/* Gauge Chart */}
      <div className="relative w-full aspect-square max-w-[300px] mx-auto">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* Marcas alrededor del gauge */}
          {ticks.map((tick, index) => (
            <line
              key={index}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tick.isHighlight ? "#8E8E8E" : "#414141"}
              strokeWidth={tick.isHighlight ? "2" : "1"}
              strokeLinecap="round"
            />
          ))}

          {/* Anillo exterior - Current Level (Cyan) */}
          <path
            d={createArc(0, gaugeData.current, 115, 130)}
            fill="#22D3EE"
          />

          {/* Anillo 2 - Highest Level (Lime) */}
          <path
            d={createArc(0, gaugeData.highest, 95, 110)}
            fill="#A3E635"
          />

          {/* Anillo 3 - Weekly Average (Yellow) */}
          <path
            d={createArc(0, gaugeData.average, 75, 90)}
            fill="#DED854"
          />

          {/* Anillo interior - Lowest Level (Green) */}
          <path
            d={createArc(0, gaugeData.lowest, 55, 70)}
            fill="#22C55E"
          />

          {/* Texto central */}
          <text
            x="150"
            y="140"
            textAnchor="middle"
            className="fill-neutral-400 text-sm"
            style={{ fontSize: "14px" }}
          >
            Trend Change
          </text>
          <text
            x="150"
            y="165"
            textAnchor="middle"
            className="fill-white font-bold"
            style={{ fontSize: "32px" }}
          >
            {trendChange > 0 ? "+" : ""}
            {trendChange.toFixed(1)}%
          </text>
        </svg>
      </div>

      {/* Leyenda */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-cyan-600 flex-shrink-0" />
          <div className="flex items-baseline gap-2">
            <span className="text-white font-semibold text-sm">Current Level</span>
            <span className="text-neutral-400 text-sm">{stats.current_level.toFixed(0)} ng/dL</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-lime-600 flex-shrink-0" />
          <div className="flex items-baseline gap-2">
            <span className="text-white font-semibold text-sm">Highest Level</span>
            <span className="text-neutral-400 text-sm">{stats.highest_level.toFixed(0)} ng/dL</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-600 flex-shrink-0" />
          <div className="flex items-baseline gap-2">
            <span className="text-white font-semibold text-sm">Weekly Average</span>
            <span className="text-neutral-400 text-sm">{stats.average_level.toFixed(0)} ng/dL</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-green-600 flex-shrink-0" />
          <div className="flex items-baseline gap-2">
            <span className="text-white font-semibold text-sm">Lowest Level</span>
            <span className="text-neutral-400 text-sm">{stats.lowest_level.toFixed(0)} ng/dL</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-neutral-400 text-xs text-center leading-relaxed">
        This is not a medical diagnosis. For accurate results, please consult your doctor or a certified laboratory.
      </p>
    </div>
  )
}
