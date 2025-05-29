"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { useLanguage } from "@/lib/i18n/language-context"
import type { HealthData } from "@/lib/api/health"
import { ChartLoading } from "./chart-loading"

interface IntervalOption {
  label: string
  value: number
}

interface TestosteroneChartProps {
  initialData?: HealthData[]
  intervals: IntervalOption[]
  selectedInterval: number
  onIntervalChange: (interval: number) => void
  isLoading: boolean
}

export default function TestosteroneChart({
  initialData = [],
  intervals,
  selectedInterval,
  onIntervalChange,
  isLoading,
}: TestosteroneChartProps) {
  const { t } = useLanguage()
  const [chartData, setChartData] = useState<HealthData[]>([])
  const [hasTestosteroneData, setHasTestosteroneData] = useState(false)

  // Usar datos iniciales al montar el componente
  useEffect(() => {
    if (initialData.length > 0) {
      // Invertir el orden para que el más reciente aparezca a la derecha
      const reversedData = [...initialData].reverse()
      setChartData(reversedData)
      setHasTestosteroneData(initialData.some((item) => item.testosterone !== null))
    }
  }, [initialData])

  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value)
    onIntervalChange(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t("charts.testosteroneLevels")}</h2>
        <select
          value={selectedInterval}
          onChange={handleIntervalChange}
          className="border rounded p-1 text-sm"
          disabled={isLoading}
        >
          {intervals.map((interval) => (
            <option key={interval.value} value={interval.value}>
              {interval.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <ChartLoading />
      ) : !hasTestosteroneData ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
          <p className="text-yellow-700 dark:text-yellow-400">{t("charts.testosteroneAnalyzing")}</p>
        </div>
      ) : (
        <div className="w-full pl-0">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(dateStr) => {
                    // Convertir la fecha de formato YYYY-MM-DD a un objeto Date
                    const date = new Date(dateStr)
                    return format(date, "dd/MM")
                  }}
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} width={45} />
                <Tooltip
                  labelFormatter={(dateStr) => {
                    // Convertir la fecha de formato YYYY-MM-DD a un objeto Date
                    const date = new Date(dateStr)
                    return format(date, "dd/MM/yyyy")
                  }}
                  formatter={(value: number | null) => {
                    return value !== null
                      ? [`${value.toFixed(0)} ng/dL`, t("charts.testosterone")]
                      : ["-", t("charts.testosterone")]
                  }}
                  contentStyle={{ fontSize: "12px", color: "#000000" }}
                />
                <Line
                  type="monotone"
                  dataKey="testosterone"
                  stroke="#3B82F6"
                  dot={false}
                  strokeWidth={2}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
