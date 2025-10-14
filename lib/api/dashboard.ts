import { apiRequest } from "./api-client"
import { authApi } from "./auth"
import type {
  EnergyLevelsResponse,
  BasicMetricsApiResponse,
  ApiErrorResponse,
} from "@/lib/types/api"

/**
 * API para los endpoints del dashboard
 * - /home/energy-levels/
 * - /home/basic-metrics/
 */
export const dashboardApi = {
  /**
   * Obtener los niveles de energía del usuario
   * Endpoint: GET /home/energy-levels/
   */
  getEnergyLevels: async (): Promise<EnergyLevelsResponse | ApiErrorResponse> => {
    const token = authApi.getToken()
    
    if (!token) {
      throw new Error("No authentication token found")
    }

    try {
      const response = await apiRequest("http://localhost:8000/v1/api/home/energy-levels/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      // Manejar errores HTTP 404 y 400
      if (response.status === 404) {
        return {
          message: "Los datos aún no están disponibles. Estamos sincronizando tu información.",
          error: "not_found",
          data: null,
        } as ApiErrorResponse
      }

      if (response.status === 400) {
        return {
          message: "Error al procesar los datos. Estamos trabajando en sincronizarlos.",
          error: "bad_request",
          data: null,
        } as ApiErrorResponse
      }

      // Status 304 (Not Modified) no tiene body, retornar error controlado
      if (response.status === 304) {
        return {
          message: "No hay datos nuevos disponibles",
          error: "not_modified",
          data: null,
        } as ApiErrorResponse
      }

      // Validar que hay contenido antes de parsear JSON
      const contentLength = response.headers.get("content-length")
      if (contentLength === "0" || !response.body) {
        return {
          message: "Respuesta vacía del servidor",
          error: "empty_response",
          data: null,
        } as ApiErrorResponse
      }

      const data = await response.json()

      if (response.ok && data.error === "") {
        return data as EnergyLevelsResponse
      } else {
        return data as ApiErrorResponse
      }
    } catch (error) {
      console.error("Error fetching energy levels:", error)
      throw error
    }
  },

  /**
   * Obtener las métricas básicas del usuario
   * Endpoint: GET /home/basic-metrics/
   */
  getBasicMetrics: async (): Promise<BasicMetricsApiResponse | ApiErrorResponse> => {
    const token = authApi.getToken()
    
    if (!token) {
      throw new Error("No authentication token found")
    }

    try {
      const response = await apiRequest("http://localhost:8000/v1/api/home/basic-metrics/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      // Manejar errores HTTP 404 y 400
      if (response.status === 404) {
        return {
          message: "Las métricas aún no están disponibles. Estamos sincronizando tu información.",
          error: "not_found",
          data: null,
        } as ApiErrorResponse
      }

      if (response.status === 400) {
        return {
          message: "Error al procesar las métricas. Estamos trabajando en sincronizarlas.",
          error: "bad_request",
          data: null,
        } as ApiErrorResponse
      }

      // Status 304 (Not Modified) no tiene body, retornar error controlado
      if (response.status === 304) {
        return {
          message: "No hay datos nuevos disponibles",
          error: "not_modified",
          data: null,
        } as ApiErrorResponse
      }

      // Validar que hay contenido antes de parsear JSON
      const contentLength = response.headers.get("content-length")
      if (contentLength === "0" || !response.body) {
        return {
          message: "Respuesta vacía del servidor",
          error: "empty_response",
          data: null,
        } as ApiErrorResponse
      }

      const data = await response.json()

      if (response.ok && data.error === "") {
        return data as BasicMetricsApiResponse
      } else {
        return data as ApiErrorResponse
      }
    } catch (error) {
      console.error("Error fetching basic metrics:", error)
      throw error
    }
  },
}
