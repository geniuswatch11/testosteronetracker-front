import { addHours, subDays, format } from "date-fns"
import type { HealthData } from "./api/health"

export function generateMockData(days: number, interval: number): HealthData[] {
  const data: HealthData[] = []
  const now = new Date()
  const startDate = subDays(now, days)

  // Asegurarse de que generamos suficientes puntos de datos
  const points = Math.max(5, Math.floor((days * 24) / interval))

  for (let i = 0; i <= points; i++) {
    const timestamp = addHours(startDate, i * interval)
    const dateStr = format(timestamp, "yyyyMMdd")

    data.push({
      timestamp,
      date: dateStr,
      testosterone: Math.random() * 300 + 300, // 300-600 ng/dL
      resting_hr: Math.random() * 30 + 50, // 50-80 bpm
      hrv: Math.random() * 50 + 30, // 30-80 miliSec
      sleep_hours: Math.random() * 4 + 4, // 4-8 horas
      sleep_efficiency: Math.random() * 0.2 + 0.75, // 75%-95%
      respiratory_rate: Math.random() * 6 + 12, // 12-18 respiraciones por minuto
      spo2: Math.random() * 0.05 + 0.94, // 94%-99%
      calories_total: Math.random() * 1000 + 1500, // 1500-2500 cal
      active_calories: Math.random() * 500 + 300, // 300-800 cal
    })
  }

  return data
}

export function calculateAverage(data: HealthData[]): {
  avgTestosterone: number
  avgRestingHr: number
  avgHrv: number
  avgSleepHours: number
  avgSleepEfficiency: number
  avgRespiratoryRate: number
  avgSpo2: number
  avgCaloriesTotal: number
  avgActiveCalories: number
} {
  const sum = data.reduce(
    (acc, point) => ({
      testosterone: acc.testosterone + point.testosterone,
      resting_hr: acc.resting_hr + point.resting_hr,
      hrv: acc.hrv + point.hrv,
      sleep_hours: acc.sleep_hours + point.sleep_hours,
      sleep_efficiency: acc.sleep_efficiency + point.sleep_efficiency,
      respiratory_rate: acc.respiratory_rate + point.respiratory_rate,
      spo2: acc.spo2 + point.spo2,
      calories_total: acc.calories_total + point.calories_total,
      active_calories: acc.active_calories + point.active_calories,
    }),
    {
      testosterone: 0,
      resting_hr: 0,
      hrv: 0,
      sleep_hours: 0,
      sleep_efficiency: 0,
      respiratory_rate: 0,
      spo2: 0,
      calories_total: 0,
      active_calories: 0,
    },
  )

  const count = data.length
  return {
    avgTestosterone: Math.round(sum.testosterone / count),
    avgRestingHr: Math.round(sum.resting_hr / count),
    avgHrv: Math.round(sum.hrv / count),
    avgSleepHours: Math.round(sum.sleep_hours * 10) / 10,
    avgSleepEfficiency: Math.round((sum.sleep_efficiency * 100) / count),
    avgRespiratoryRate: Math.round((sum.respiratory_rate * 10) / count) / 10,
    avgSpo2: Math.round((sum.spo2 * 100) / count),
    avgCaloriesTotal: Math.round(sum.calories_total / count),
    avgActiveCalories: Math.round(sum.active_calories / count),
  }
}
