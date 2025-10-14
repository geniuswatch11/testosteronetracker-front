"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { metricsApi } from "@/lib/api/metrics"
import type { SleepEfficiencyDataPoint, ApiErrorResponse } from "@/lib/types/api"

interface SleepEfficiencyBarChartProps {
  period: string
}

export function SleepEfficiencyBarChart({ period }: SleepEfficiencyBarChartProps) {
  const [data, setData] = useState<SleepEfficiencyDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await metricsApi.getSleepEfficiencyStats()

        if ("error" in response && response.error !== "") {
          const errorResponse = response as ApiErrorResponse
          setError(errorResponse.message || "Error al cargar datos")
        } else {
          const newData = (response.data || []) as SleepEfficiencyDataPoint[]
          if (newData.length > 0) {
            setData(newData)
          }
        }
      } catch (err) {
        console.error("Error fetching sleep efficiency stats:", err)
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
          <h3 className="text-white text-lg font-semibold">Sleep Efficiency</h3>
          <InfoTooltip description="Sleep efficiency measures the percentage of time spent actually sleeping while in bed. Keep staying at this intensity to maintain optimal balanced output." />
        </div>
        <div className="h-48 flex items-center justify-center">
          <div className="text-neutral-400">Loading...</div>
        </div>
      </div>
    )
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="bg-neutral-600 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Sleep Efficiency</h3>
          <InfoTooltip description="Sleep efficiency measures the percentage of time spent actually sleeping while in bed. Keep staying at this intensity to maintain optimal balanced output." />
        </div>
        <div className="h-48 flex items-center justify-center">
          <div className="text-neutral-400 text-center text-sm">{error || "No data available"}</div>
        </div>
      </div>
    )
  }

  const getFilteredData = () => {
    const weeks = parseInt(period.replace("w", ""))
    const daysToShow = weeks * 7
    const sortedData = [...data].sort((a, b) => b.day_index - a.day_index)
    return sortedData.slice(0, daysToShow).reverse()
  }

  const filteredData = getFilteredData()

  const chartData = filteredData.map((item) => {
    const date = new Date(item.date)
    const day = date.getDate()
    const month = date.toLocaleDateString("en-US", { month: "short" })
    return {
      time: `${day} ${month}`,
      value: item.sleep_efficiency,
    }
  })

  return (
    <div className="bg-neutral-600 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">Sleep Efficiency</h3>
        <InfoTooltip description="Sleep efficiency measures the percentage of time spent actually sleeping while in bed. Keep staying at this intensity to maintain optimal balanced output." />
      </div>
      <div className="text-neutral-400 text-xs mb-4">
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white"></span>
          Keep staying at this intensity to maintain optimal balanced output
        </span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
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
              <Cell key={`cell-${index}`} fill="#FFFFFF" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
