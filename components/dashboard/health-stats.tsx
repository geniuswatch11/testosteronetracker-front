"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { useLanguage } from "@/lib/i18n/language-context"
import type { HealthData } from "@/lib/api/health"
import { ChartLoading } from "./chart-loading"
import { Skeleton } from "@/components/ui/skeleton"

interface IntervalOption {
  label: string
  value: number
}

interface HealthStatsProps {
  initialData?: HealthData[]
  intervals: IntervalOption[]
  selectedInterval: number
  onIntervalChange: (interval: number) => void
  isLoading: boolean
}

export default function HealthStats({
  initialData = [],
  intervals,
  selectedInterval,
  onIntervalChange,
  isLoading,
}: HealthStatsProps) {
  const { t } = useLanguage()

  const colors = {
    resting_hr: "#94A3B8",
    hrv: "#93C5FD",
    sleep_hours: "#A5B4FC",
    sleep_efficiency: "#FCA5A5",
    respiratory_rate: "#FDBA74",
    spo2: "#86EFAC",
    calories_total: "#F9A8D4",
  }

  const [data, setData] = useState<HealthData[]>([])
  const [latestData, setLatestData] = useState<HealthData | null>(null)

  useEffect(() => {
    if (initialData.length > 0) {
      // Invertir el orden para que el más reciente aparezca a la derecha
      const reversedData = [...initialData].reverse()
      setData(reversedData)
      setLatestData(initialData[0]) // El primer elemento es el más reciente
    }
  }, [initialData])

  // Función para formatear valores posiblemente nulos
  const formatValue = (value: number | null, format: (v: number) => string): string => {
    return value !== null ? format(value) : "-"
  }

  // Filtrar las métricas que tienen valores no nulos en el último punto de datos
  const hasMetricData = (metric: keyof HealthData): boolean => {
    return data.some((point) => point[metric] !== null)
  }

  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value)
    onIntervalChange(value)
  }

  // Renderizar un valor con animación de carga o el valor real
  const renderValue = (value: number | null, formatter: (v: number) => string) => {
    if (isLoading) {
      return <Skeleton className="h-7 w-16" />
    }
    return <div className="text-xl font-bold">{value !== null ? formatter(value) : "-"}</div>
  }

  // Custom legend that renders outside the chart
  const renderCustomLegend = () => {
    const activeMetrics = [
      { key: "resting_hr", name: t("charts.restingHr"), color: colors.resting_hr, active: hasMetricData("resting_hr") },
      { key: "hrv", name: t("charts.hrv"), color: colors.hrv, active: hasMetricData("hrv") },
      {
        key: "sleep_hours",
        name: t("charts.sleepHours"),
        color: colors.sleep_hours,
        active: hasMetricData("sleep_hours"),
      },
      {
        key: "sleep_efficiency",
        name: t("charts.sleepEfficiency"),
        color: colors.sleep_efficiency,
        active: hasMetricData("sleep_efficiency"),
      },
    ].filter((metric) => metric.active)

    return (
      <div className="flex flex-wrap gap-3 mb-6 text-xs">
        {activeMetrics.map((metric) => (
          <div key={metric.key} className="flex items-center">
            <span className="inline-block w-3 h-3 mr-1 rounded-full" style={{ backgroundColor: metric.color }} />
            <span>{metric.name}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">{t("charts.healthStats")}</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">{t("charts.restingHr")}</div>
          <div style={{ color: colors.resting_hr }}>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-xl font-bold">
                {latestData ? formatValue(latestData.resting_hr, (v) => `${v.toFixed(0)} bpm`) : "-"}
              </div>
            )}
          </div>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">{t("charts.hrv")}</div>
          <div style={{ color: colors.hrv }}>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-xl font-bold">
                {latestData ? formatValue(latestData.hrv, (v) => `${v.toFixed(0)} ms`) : "-"}
              </div>
            )}
          </div>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">{t("charts.sleepHours")}</div>
          <div style={{ color: colors.sleep_hours }}>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-xl font-bold">
                {latestData ? formatValue(latestData.sleep_hours, (v) => `${v.toFixed(1)} h`) : "-"}
              </div>
            )}
          </div>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">{t("charts.sleepEfficiency")}</div>
          <div style={{ color: colors.sleep_efficiency }}>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-xl font-bold">
                {latestData ? formatValue(latestData.sleep_efficiency, (v) => `${(v * 100).toFixed(0)}%`) : "-"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">{t("charts.respiratoryRate")}</div>
          <div style={{ color: colors.respiratory_rate }}>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-xl font-bold">
                {latestData ? formatValue(latestData.respiratory_rate, (v) => `${v.toFixed(1)} rpm`) : "-"}
              </div>
            )}
          </div>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">{t("charts.spo2")}</div>
          <div style={{ color: colors.spo2 }}>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-xl font-bold">
                {latestData ? formatValue(latestData.spo2, (v) => `${(v * 100).toFixed(0)}%`) : "-"}
              </div>
            )}
          </div>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">{t("charts.caloriesTotal")}</div>
          <div style={{ color: colors.calories_total }}>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-xl font-bold">
                {latestData ? formatValue(latestData.calories_total, (v) => `${v.toFixed(0)} cal`) : "-"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t("charts.metricsEvolution")}</h3>
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

        {/* Custom legend outside the chart */}
        {!isLoading && renderCustomLegend()}

        {isLoading ? (
          <ChartLoading />
        ) : (
          <div className="w-full pl-0">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
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
                    contentStyle={{ fontSize: "12px", color: "#000000" }}
                    formatter={(value: number | null, name: string) => {
                      if (value === null) return ["-", name]

                      switch (name) {
                        case "resting_hr":
                          return [`${value.toFixed(0)} bpm`, t("charts.restingHr")]
                        case "hrv":
                          return [`${value.toFixed(0)} ms`, t("charts.hrv")]
                        case "sleep_hours":
                          return [`${value.toFixed(1)} h`, t("charts.sleepHours")]
                        case "sleep_efficiency":
                          return [`${(value * 100).toFixed(0)}%`, t("charts.sleepEfficiency")]
                        case "respiratory_rate":
                          return [`${value.toFixed(1)} rpm`, t("charts.respiratoryRate")]
                        case "spo2":
                          return [`${(value * 100).toFixed(0)}%`, t("charts.spo2")]
                        case "calories_total":
                          return [`${value.toFixed(0)} cal`, t("charts.caloriesTotal")]
                        default:
                          return [value, name]
                      }
                    }}
                  />
                  {/* Removed the built-in Legend component */}

                  {/* Solo mostrar líneas para métricas con datos */}
                  {hasMetricData("resting_hr") && (
                    <Line
                      type="monotone"
                      dataKey="resting_hr"
                      name={t("charts.restingHr")}
                      stroke={colors.resting_hr}
                      dot={false}
                      strokeWidth={1.5}
                      connectNulls={false}
                    />
                  )}

                  {hasMetricData("hrv") && (
                    <Line
                      type="monotone"
                      dataKey="hrv"
                      name={t("charts.hrv")}
                      stroke={colors.hrv}
                      dot={false}
                      strokeWidth={1.5}
                      connectNulls={false}
                    />
                  )}

                  {hasMetricData("sleep_hours") && (
                    <Line
                      type="monotone"
                      dataKey="sleep_hours"
                      name={t("charts.sleepHours")}
                      stroke={colors.sleep_hours}
                      dot={false}
                      strokeWidth={1.5}
                      connectNulls={false}
                    />
                  )}

                  {hasMetricData("sleep_efficiency") && (
                    <Line
                      type="monotone"
                      dataKey="sleep_efficiency"
                      name={t("charts.sleepEfficiency")}
                      stroke={colors.sleep_efficiency}
                      dot={false}
                      strokeWidth={1.5}
                      connectNulls={false}
                      // Multiplicar por 100 para mostrar como porcentaje
                      yAxisId="percentage"
                    />
                  )}

                  <YAxis
                    yAxisId="percentage"
                    orientation="right"
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    hide
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
