"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Dot } from "recharts"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { metricsApi } from "@/lib/api/metrics"
import type { SleepInterruptionsDataPoint, ApiErrorResponse } from "@/lib/types/api"

interface SleepInterruptionsLineChartProps {
  period: string
}

export function SleepInterruptionsLineChart({ period }: SleepInterruptionsLineChartProps) {
  const [data, setData] = useState<SleepInterruptionsDataPoint[]>([])
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
          const newData = (response.data || []) as SleepInterruptionsDataPoint[]
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

  if (isLoading) {
    return (
      <div className="bg-neutral-600 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Sleep Interruptions</h3>
          <InfoTooltip description="Monitor the number of times your sleep was interrupted during the night. Lower values indicate better sleep quality." />
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
          <h3 className="text-white text-lg font-semibold">Sleep Interruptions</h3>
          <InfoTooltip description="Monitor the number of times your sleep was interrupted during the night. Lower values indicate better sleep quality." />
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
      value: item.sleep_interruptions,
    }
  })

  return (
    <div className="bg-neutral-600 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">Sleep Interruptions</h3>
        <InfoTooltip description="Monitor the number of times your sleep was interrupted during the night. Lower values indicate better sleep quality." />
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="time"
            stroke="#8E8E8E"
            tick={{ fill: "#8E8E8E", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={[0, 20]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22D3EE"
            strokeWidth={2}
            dot={<Dot r={4} fill="#22D3EE" />}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
