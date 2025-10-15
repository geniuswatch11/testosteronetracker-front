import { apiRequest } from "./api-client"
import { authApi } from "./auth"
import type {
  BasicMetricsResponse,
  ApiErrorResponse,
  CaloriesStatsResponse,
  HeartRateStatsResponse,
  SleepDurationStatsResponse,
  SleepEfficiencyStatsResponse,
  SleepInterruptionsStatsResponse,
  Spo2StatsResponse,
} from "@/lib/types/api"

const API_BASE_URL = "https://main.geniushpro.com/v1/api"

/**
 * API para métricas básicas y estadísticas
 */
export const metricsApi = {
  /**
   * Obtiene las métricas básicas del usuario
   * GET /home/basic-metrics/
   * Maneja respuestas 304 Not Modified del caché de Redis
   */
  getBasicMetrics: async (): Promise<BasicMetricsResponse | ApiErrorResponse> => {
    const token = authApi.getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    try {
      const response = await apiRequest(`${API_BASE_URL}/home/basic-metrics/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      // 304 Not Modified - datos del caché de Redis
      if (response.status === 304) {
        // Los datos no han cambiado, el navegador usará su caché
        // Retornamos una respuesta vacía que indica usar datos cacheados
        return {
          message: "Datos obtenidos del caché",
          error: "",
          data: {} as any, // El componente debe usar sus datos previos
        } as BasicMetricsResponse
      }

      const data = await response.json()

      // Si la respuesta no es exitosa (400, 500, etc.)
      if (!response.ok) {
        return data as ApiErrorResponse
      }

      return data as BasicMetricsResponse
    } catch (error) {
      console.error("Error fetching basic metrics:", error)
      throw error
    }
  },

  /**
   * Obtiene las estadísticas de calorías
   * GET /stats/calories
   * Maneja respuestas 304 Not Modified del caché de Redis
   */
  getCaloriesStats: async (): Promise<CaloriesStatsResponse | ApiErrorResponse> => {
    const token = authApi.getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    try {
      const response = await apiRequest(`${API_BASE_URL}/stats/calories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      // 304 Not Modified - datos del caché de Redis
      if (response.status === 304) {
        return {
          message: "Datos obtenidos del caché",
          error: "",
          data: [],
        }
      }

      const data = await response.json()

      if (!response.ok) {
        return data as ApiErrorResponse
      }

      return data
    } catch (error) {
      console.error("Error fetching calories stats:", error)
      throw error
    }
  },

  /**
   * Obtiene las estadísticas de frecuencia cardíaca
   * GET /stats/heartrate/
   * Maneja respuestas 304 Not Modified del caché de Redis
   */
  getHeartRateStats: async (): Promise<HeartRateStatsResponse | ApiErrorResponse> => {
    const token = authApi.getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    try {
      const response = await apiRequest(`${API_BASE_URL}/stats/heartrate/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      // 304 Not Modified - datos del caché de Redis
      if (response.status === 304) {
        return {
          message: "Datos obtenidos del caché",
          error: "",
          data: [],
        }
      }

      const data = await response.json()

      if (!response.ok) {
        return data as ApiErrorResponse
      }

      return data
    } catch (error) {
      console.error("Error fetching heart rate stats:", error)
      throw error
    }
  },

  /**
   * Obtiene las estadísticas de duración del sueño
   * GET /stats/sleep-duration/
   * Maneja respuestas 304 Not Modified del caché de Redis
   */
  getSleepDurationStats: async (): Promise<SleepDurationStatsResponse | ApiErrorResponse> => {
    const token = authApi.getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    try {
      const response = await apiRequest(`${API_BASE_URL}/stats/sleep-duration/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      // 304 Not Modified - datos del caché de Redis
      if (response.status === 304) {
        return {
          message: "Datos obtenidos del caché",
          error: "",
          data: [],
        }
      }

      const data = await response.json()

      if (!response.ok) {
        return data as ApiErrorResponse
      }

      return data
    } catch (error) {
      console.error("Error fetching sleep duration stats:", error)
      throw error
    }
  },

  /**
   * Obtiene las estadísticas de eficiencia del sueño
   * GET /stats/sleep-efficiency/
   * Maneja respuestas 304 Not Modified del caché de Redis
   */
  getSleepEfficiencyStats: async (): Promise<SleepEfficiencyStatsResponse | ApiErrorResponse> => {
    const token = authApi.getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    try {
      const response = await apiRequest(`${API_BASE_URL}/stats/sleep-efficiency/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      // 304 Not Modified - datos del caché de Redis
      if (response.status === 304) {
        return {
          message: "Datos obtenidos del caché",
          error: "",
          data: [],
        }
      }

      const data = await response.json()

      if (!response.ok) {
        return data as ApiErrorResponse
      }

      return data
    } catch (error) {
      console.error("Error fetching sleep efficiency stats:", error)
      throw error
    }
  },

  /**
   * Obtiene las estadísticas de interrupciones del sueño
   * GET /stats/sleep-interruptions/
   * Maneja respuestas 304 Not Modified del caché de Redis
   */
  getSleepInterruptionsStats: async (): Promise<SleepInterruptionsStatsResponse | ApiErrorResponse> => {
    const token = authApi.getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    try {
      const response = await apiRequest(`${API_BASE_URL}/stats/sleep-interruptions/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      // 304 Not Modified - datos del caché de Redis
      if (response.status === 304) {
        return {
          message: "Datos obtenidos del caché",
          error: "",
          data: [],
        }
      }

      const data = await response.json()

      if (!response.ok) {
        return data as ApiErrorResponse
      }

      return data
    } catch (error) {
      console.error("Error fetching sleep interruptions stats:", error)
      throw error
    }
  },

  /**
   * Obtiene las estadísticas de SpO2
   * GET /stats/spo2/
   * Maneja respuestas 304 Not Modified del caché de Redis
   */
  getSpo2Stats: async (): Promise<Spo2StatsResponse | ApiErrorResponse> => {
    const token = authApi.getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    try {
      const response = await apiRequest(`${API_BASE_URL}/stats/spo2/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      // 304 Not Modified - datos del caché de Redis
      if (response.status === 304) {
        return {
          message: "Datos obtenidos del caché",
          error: "",
          data: [],
        }
      }

      const data = await response.json()

      if (!response.ok) {
        return data as ApiErrorResponse
      }

      return data
    } catch (error) {
      console.error("Error fetching SpO2 stats:", error)
      throw error
    }
  },
}
