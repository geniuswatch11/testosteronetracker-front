import { format } from "date-fns"
import { authApi } from "./auth"
import { apiRequest } from "./api-client"

export interface HealthData {
  timestamp?: Date // Mantenemos para compatibilidad
  date: string // Formato YYYY-MM-DD
  testosterone: number | null // ng/dL
  testosterone_normalized?: number | null // Valor normalizado
  resting_hr: number | null // bpm
  hrv: number | null // miliSec
  sleep_hours: number | null // horas
  sleep_efficiency: number | null // porcentaje (0-1)
  respiratory_rate: number | null // respiraciones por minuto
  spo2: number | null // porcentaje (0-1)
  calories_total: number | null // cal
  active_calories: number | null // cal
}

export interface HealthStats {
  avgTestosterone: number | null
  avgRestingHr: number | null
  avgHrv: number | null
  avgSleepHours: number | null
  avgSleepEfficiency: number | null
  avgRespiratoryRate: number | null
  avgSpo2: number | null
  avgCaloriesTotal: number | null
  avgActiveCalories: number | null
}

export interface UserHealthResponse {
  status: "complete" | "incomplete"
  value?: "whoop" | "personalData"
  data?: HealthData[]
}

export const USER_STATUS_KEY = "userStatus"

export const healthApi = {
  getUserHealthData: async (days: number, interval: number): Promise<UserHealthResponse> => {
    // Obtener el token de autenticación
    const token = authApi.getToken()

    if (!token) {
      return { status: "incomplete", value: "whoop" }
    }

    // Determinar el intervalo para la API
    let apiInterval = "day"
    if (days >= 7 && days < 30) {
      apiInterval = "week"
    } else if (days >= 30) {
      apiInterval = "month"
    }

    try {
      // Hacer la petición a la API usando apiRequest
      const response = await apiRequest(`https://api.geniushpro.com/whoopdata/${token}?interval=${apiInterval}`)

      // Manejar errores de servidor explícitamente
      if (response.status === 500) {
        throw new Error("Server error: 500 Internal Server Error")
      }

      if (!response.ok) {
        // Si hay un error, verificar si es porque el usuario no ha completado su perfil
        if (response.status === 404) {
          const userStatus = localStorage.getItem(USER_STATUS_KEY)
          if (!userStatus) {
            localStorage.setItem(USER_STATUS_KEY, JSON.stringify({ status: "incomplete", value: "whoop" }))
            return { status: "incomplete", value: "whoop" }
          }

          const status = JSON.parse(userStatus)
          return { status: "incomplete", value: status.value || "whoop" }
        }

        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      // Procesar los datos
      const apiData: HealthData[] = await response.json()

      // Convertir los datos para incluir timestamp para compatibilidad
      const processedData = apiData.map((item) => {
        // La fecha ya viene en formato YYYY-MM-DD, así que la parseamos directamente
        const timestamp = new Date(item.date)

        return {
          ...item,
          timestamp,
        }
      })

      return { status: "complete", data: processedData }
    } catch (error) {
      console.error("Error fetching health data:", error)

      // Si hay un error, usar datos simulados para desarrollo
      if (process.env.NODE_ENV === "development") {
        console.warn("Using mock data for development")
        const mockData = await healthApi.generateHealthData(days, interval)
        return { status: "complete", data: mockData }
      }

      // En producción, propagar el error para que se maneje en el componente
      throw error
    }
  },

  generateHealthData: async (days: number, interval: number): Promise<HealthData[]> => {
    const data: HealthData[] = []
    const now = new Date()

    // Generar datos para el número de días solicitado
    for (let i = 0; i < days; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = format(date, "yyyy-MM-dd") // Formato YYYY-MM-DD

      // Simular algunos valores nulos aleatoriamente
      const includeTestosterone = Math.random() > 0.2 // 20% de probabilidad de que sea nulo

      data.push({
        timestamp: date,
        date: dateStr,
        testosterone: includeTestosterone ? Math.random() * 300 + 300 : null, // 300-600 ng/dL o null
        resting_hr: Math.random() > 0.1 ? Math.random() * 30 + 50 : null, // 50-80 bpm o null
        hrv: Math.random() > 0.1 ? Math.random() * 50 + 30 : null, // 30-80 miliSec o null
        sleep_hours: Math.random() > 0.1 ? Math.random() * 4 + 4 : null, // 4-8 horas o null
        sleep_efficiency: Math.random() > 0.1 ? Math.random() * 0.2 + 0.75 : null, // 75%-95% o null
        respiratory_rate: Math.random() > 0.1 ? Math.random() * 6 + 12 : null, // 12-18 respiraciones por minuto o null
        spo2: Math.random() > 0.1 ? Math.random() * 0.05 + 0.94 : null, // 94%-99% o null
        calories_total: Math.random() > 0.1 ? Math.random() * 1000 + 1500 : null, // 1500-2500 cal o null
        active_calories: Math.random() > 0.1 ? Math.random() * 500 + 300 : null, // 300-800 cal o null
      })
    }

    return data
  },

  getHealthStats: async (data: HealthData[]): Promise<HealthStats> => {
    // Inicializar contadores y sumas
    const sums: { [key: string]: number } = {
      testosterone: 0,
      resting_hr: 0,
      hrv: 0,
      sleep_hours: 0,
      sleep_efficiency: 0,
      respiratory_rate: 0,
      spo2: 0,
      calories_total: 0,
      active_calories: 0,
    }

    const counts: { [key: string]: number } = {
      testosterone: 0,
      resting_hr: 0,
      hrv: 0,
      sleep_hours: 0,
      sleep_efficiency: 0,
      respiratory_rate: 0,
      spo2: 0,
      calories_total: 0,
      active_calories: 0,
    }

    // Sumar valores no nulos
    data.forEach((point) => {
      Object.keys(sums).forEach((key) => {
        const value = point[key as keyof HealthData]
        if (value !== null && value !== undefined) {
          sums[key] += value as number
          counts[key]++
        }
      })
    })

    // Calcular promedios
    return {
      avgTestosterone: counts.testosterone > 0 ? Math.round(sums.testosterone / counts.testosterone) : null,
      avgRestingHr: counts.resting_hr > 0 ? Math.round(sums.resting_hr / counts.resting_hr) : null,
      avgHrv: counts.hrv > 0 ? Math.round(sums.hrv / counts.hrv) : null,
      avgSleepHours: counts.sleep_hours > 0 ? Math.round((sums.sleep_hours * 10) / counts.sleep_hours) / 10 : null,
      avgSleepEfficiency:
        counts.sleep_efficiency > 0 ? Math.round((sums.sleep_efficiency * 100) / counts.sleep_efficiency) : null,
      avgRespiratoryRate:
        counts.respiratory_rate > 0 ? Math.round((sums.respiratory_rate * 10) / counts.respiratory_rate) / 10 : null,
      avgSpo2: counts.spo2 > 0 ? Math.round((sums.spo2 * 100) / counts.spo2) : null,
      avgCaloriesTotal: counts.calories_total > 0 ? Math.round(sums.calories_total / counts.calories_total) : null,
      avgActiveCalories: counts.active_calories > 0 ? Math.round(sums.active_calories / counts.active_calories) : null,
    }
  },

  updateUserStatus: (value: "whoop" | "personalData" | "complete") => {
    if (value === "complete") {
      localStorage.setItem(USER_STATUS_KEY, JSON.stringify({ status: "complete" }))
    } else {
      localStorage.setItem(USER_STATUS_KEY, JSON.stringify({ status: "incomplete", value }))
    }
  },
}
