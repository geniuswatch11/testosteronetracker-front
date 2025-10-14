"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { TimeFilter } from "@/components/stats/time-filter"
import { CaloriesBurnedChart } from "@/components/stats/calories-burned-chart"
import { SleepEfficiencyBarChart } from "@/components/stats/sleep-efficiency-bar-chart"
import { SleepDurationLineChart } from "@/components/stats/sleep-duration-line-chart"
import { SleepInterruptionsLineChart } from "@/components/stats/sleep-interruptions-line-chart"
import { HeartRateRestingBarChart } from "@/components/stats/heartrate-resting-bar-chart"
import { Spo2LineChart } from "@/components/stats/spo2-line-chart"

/**
 * Stats Page - Muestra gráficos de estadísticas de salud
 * Diseño basado en las imágenes proporcionadas
 * Cada sección tiene su propio filtro de período independiente
 */
export default function StatsPage() {
  const [sleepPeriod, setSleepPeriod] = useState("1w")
  const [recoveryPeriod, setRecoveryPeriod] = useState("1w")
  const [activityPeriod, setActivityPeriod] = useState("3w")

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header con Avatar y Notificaciones */}
        <PageHeader />

        {/* Sección Sleep */}
        <div className="space-y-4">
          <h2 className="text-white text-2xl font-bold">Sleep</h2>

          {/* Filtros de Tiempo - Sleep */}
          <TimeFilter selectedPeriod={sleepPeriod} onPeriodChange={setSleepPeriod} />

          {/* Gráficos de Sleep */}
          <div className="space-y-4">
            <SleepEfficiencyBarChart period={sleepPeriod} />
            <SleepDurationLineChart period={sleepPeriod} />
            <SleepInterruptionsLineChart period={sleepPeriod} />
          </div>
        </div>

        {/* Sección Recovery & nervous system */}
        <div className="space-y-4 pt-8">
          <h2 className="text-white text-2xl font-bold">Recovery & nervous system</h2>

          {/* Filtros de Tiempo - Recovery */}
          <TimeFilter selectedPeriod={recoveryPeriod} onPeriodChange={setRecoveryPeriod} />

          {/* Gráficos de Recovery */}
          <div className="space-y-4">
            <SleepInterruptionsLineChart period={recoveryPeriod} />
            <HeartRateRestingBarChart period={recoveryPeriod} />
            <Spo2LineChart period={recoveryPeriod} />
          </div>
        </div>

        {/* Sección Activity and context */}
        <div className="space-y-4 pt-8">
          <h2 className="text-white text-2xl font-bold">Activity and context</h2>

          {/* Filtros de Tiempo - Activity */}
          <TimeFilter selectedPeriod={activityPeriod} onPeriodChange={setActivityPeriod} />

          {/* Gráficos de Activity */}
          <div className="space-y-4">
            <CaloriesBurnedChart period={activityPeriod} />
          </div>
        </div>
      </div>
    </div>
  )
}
