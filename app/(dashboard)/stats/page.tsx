"use client"

import { CaloriesChart } from "@/components/stats/calories-chart"
import { HeartRateChart } from "@/components/stats/heart-rate-chart"
import { SleepDurationChart } from "@/components/stats/sleep-duration-chart"
import { SleepEfficiencyChart } from "@/components/stats/sleep-efficiency-chart"
import { SleepInterruptionsChart } from "@/components/stats/sleep-interruptions-chart"
import { Spo2Chart } from "@/components/stats/spo2-chart"

/**
 * Stats Page - Muestra gráficos de estadísticas de salud
 * Cada gráfico consume su propio endpoint de la API
 */
export default function StatsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Título de la página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Estadísticas</h1>
        <p className="text-neutral-400 mt-2">
          Visualiza tus métricas de salud a lo largo del tiempo
        </p>
      </div>

      {/* Grid de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CaloriesChart />
        <HeartRateChart />
        <SleepDurationChart />
        <SleepEfficiencyChart />
        <SleepInterruptionsChart />
        <Spo2Chart />
      </div>
    </div>
  )
}
