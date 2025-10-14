import { authApi } from "./auth"
import { apiRequest } from "./api-client"
import type {
  ApiResponse,
  SpikeAddDeviceRequestData,
  SpikeAddDeviceResponse,
  SpikeTaskStatusResponse,
  SpikeTaskResultResponse,
  SpikeConsentCallbackRequestData,
  SpikeConsentCallbackResponse,
  SpikeFaqRequestData,
  SpikeFaqResponse,
  ApiErrorResponse,
} from "@/lib/types/api"

const API_BASE_URL = "http://localhost:8000/v1/api"

export const spikeApi = {
  /**
   * Paso 1: Iniciar el proceso de integración del dispositivo
   * POST /spike/add/
   * @returns task_id y provider
   */
  addDevice: async (data: SpikeAddDeviceRequestData): Promise<SpikeAddDeviceResponse> => {
    const token = authApi.getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await apiRequest(`${API_BASE_URL}/spike/add/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (response.status === 202) {
      const result: SpikeAddDeviceResponse = await response.json()
      return result
    }

    // Manejar errores
    const errorData: ApiErrorResponse = await response.json()
    throw new Error(errorData.message || "Error adding device")
  },

  /**
   * Paso 2: Consultar el estado de la tarea
   * GET /spike/status/:task_id/
   * @returns status de la tarea (PENDING, RETRY, SUCCESS, FAILURE)
   */
  getTaskStatus: async (taskId: string): Promise<SpikeTaskStatusResponse> => {
    const token = authApi.getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await apiRequest(`${API_BASE_URL}/spike/status/${taskId}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const result: SpikeTaskStatusResponse = await response.json()
      return result
    }

    // Manejar errores
    const errorData: ApiErrorResponse = await response.json()
    throw new Error(errorData.message || "Error getting task status")
  },

  /**
   * Paso 3: Obtener los resultados de la tarea completada
   * GET /spike/results/:task_id/
   * @returns integration_url para redirigir al usuario
   */
  getTaskResults: async (taskId: string): Promise<SpikeTaskResultResponse> => {
    const token = authApi.getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await apiRequest(`${API_BASE_URL}/spike/results/${taskId}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const result: SpikeTaskResultResponse = await response.json()
      return result
    }

    // Manejar errores
    const errorData: ApiErrorResponse = await response.json()
    throw new Error(errorData.message || "Error getting task results")
  },

  /**
   * Paso 4: Enviar el consentimiento del usuario
   * POST /spike/consent-callback/
   * @param consentGiven - true si el usuario completó la integración, false si hubo error
   */
  sendConsent: async (data: SpikeConsentCallbackRequestData): Promise<SpikeConsentCallbackResponse> => {
    const token = authApi.getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    console.log("🔷 [SPIKE API] sendConsent - Enviando datos:", data)

    const response = await apiRequest(`${API_BASE_URL}/spike/consent-callback/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    console.log("🔷 [SPIKE API] sendConsent - Status:", response.status)

    if (response.ok) {
      const result: SpikeConsentCallbackResponse = await response.json()
      console.log("🔷 [SPIKE API] sendConsent - Respuesta exitosa:", result)
      return result
    }

    // Manejar errores
    const errorData: ApiErrorResponse = await response.json()
    console.error("🔷 [SPIKE API] sendConsent - Error:", errorData)
    throw new Error(errorData.message || "Error sending consent")
  },

  /**
   * Desconectar dispositivo
   * POST /spike/delete/:spike_id/
   * @param spikeId - ID del dispositivo Spike a desconectar
   */
  deleteDevice: async (spikeId: number): Promise<ApiResponse<{ message: string }>> => {
    const token = authApi.getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    console.log("🔷 [SPIKE API] deleteDevice - Desconectando spike_id:", spikeId)

    const response = await apiRequest(`${API_BASE_URL}/spike/delete/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("🔷 [SPIKE API] deleteDevice - Status:", response.status)

    if (response.ok) {
      const result: ApiResponse<{ message: string }> = await response.json()
      console.log("🔷 [SPIKE API] deleteDevice - Respuesta exitosa:", result)
      return result
    }

    // Manejar errores
    const errorData: ApiErrorResponse = await response.json()
    console.error("🔷 [SPIKE API] deleteDevice - Error:", errorData)
    throw new Error(errorData.message || "Error deleting device")
  },

  /**
   * Enviar respuestas del cuestionario diario (FAQ)
   * PATCH /spike/faq/
   * @param data - Respuestas del cuestionario
   */
  submitFaq: async (data: SpikeFaqRequestData): Promise<SpikeFaqResponse> => {
    const token = authApi.getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    console.log("🔷 [SPIKE API] submitFaq - Enviando respuestas:", data)

    const response = await apiRequest(`${API_BASE_URL}/spike/faq/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    console.log("🔷 [SPIKE API] submitFaq - Status:", response.status)

    if (response.ok) {
      const result: SpikeFaqResponse = await response.json()
      console.log("🔷 [SPIKE API] submitFaq - Respuesta exitosa:", result)
      return result
    }

    // Manejar errores
    const errorData: ApiErrorResponse = await response.json()
    console.error("🔷 [SPIKE API] submitFaq - Error:", errorData)
    throw new Error(errorData.message || "Error submitting FAQ")
  },
}
