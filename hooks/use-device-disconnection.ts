import { useState, useCallback } from "react"
import { spikeApi } from "@/lib/api/spike"
import type { SpikeTaskStatus } from "@/lib/types/api"

interface UseDeviceDisconnectionState {
  isDisconnecting: boolean
  error: string | null
}

interface UseDeviceDisconnectionReturn extends UseDeviceDisconnectionState {
  disconnectDevice: () => Promise<boolean>
  resetDisconnection: () => void
}

const MAX_POLLING_ATTEMPTS = 3
const POLLING_INTERVAL = 2000 // 2 segundos entre cada intento

/**
 * Hook personalizado para manejar la desconexión de dispositivos con polling
 * Verifica el estado de la tarea hasta 3 veces antes de mostrar error
 */
export function useDeviceDisconnection(): UseDeviceDisconnectionReturn {
  const [state, setState] = useState<UseDeviceDisconnectionState>({
    isDisconnecting: false,
    error: null,
  })

  /**
   * Función auxiliar para hacer polling del estado de la tarea
   * @param taskId - ID de la tarea de Celery
   * @returns true si la tarea fue exitosa, false si falló después de 3 intentos
   */
  const pollTaskStatus = async (taskId: string): Promise<boolean> => {
    let attempts = 0

    while (attempts < MAX_POLLING_ATTEMPTS) {
      attempts++
      console.log(`🔷 [DISCONNECTION] Intento ${attempts}/${MAX_POLLING_ATTEMPTS} - Consultando estado de tarea: ${taskId}`)

      try {
        const statusResponse = await spikeApi.getTaskStatus(taskId)
        const status: SpikeTaskStatus = statusResponse.data.status

        console.log(`🔷 [DISCONNECTION] Estado de la tarea: ${status}`)

        if (status === "SUCCESS") {
          console.log("✅ [DISCONNECTION] Dispositivo desconectado exitosamente")
          return true
        }

        if (status === "FAILURE") {
          console.error("❌ [DISCONNECTION] La tarea falló en el backend")
          return false
        }

        // Si el estado es PENDING o RETRY, esperar antes del siguiente intento
        if (attempts < MAX_POLLING_ATTEMPTS) {
          console.log(`⏳ [DISCONNECTION] Estado: ${status}. Esperando ${POLLING_INTERVAL}ms antes del siguiente intento...`)
          await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL))
        }
      } catch (error) {
        console.error(`❌ [DISCONNECTION] Error al consultar estado (intento ${attempts}):`, error)
        
        // Si es el último intento, retornar false
        if (attempts >= MAX_POLLING_ATTEMPTS) {
          return false
        }
        
        // Esperar antes de reintentar
        await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL))
      }
    }

    // Si llegamos aquí, significa que se agotaron los intentos sin éxito
    console.error("❌ [DISCONNECTION] Se agotaron los intentos de polling")
    return false
  }

  /**
   * Iniciar el proceso de desconexión del dispositivo
   * @returns true si la desconexión fue exitosa, false si falló
   */
  const disconnectDevice = useCallback(async (): Promise<boolean> => {
    setState({
      isDisconnecting: true,
      error: null,
    })

    try {
      // Paso 1: Iniciar la desconexión
      console.log("🔷 [DISCONNECTION] Iniciando proceso de desconexión...")
      const response = await spikeApi.deleteDevice()
      const { task_id } = response.data

      console.log(`🔷 [DISCONNECTION] Tarea de desconexión creada: ${task_id}`)

      // Paso 2: Hacer polling del estado de la tarea
      const success = await pollTaskStatus(task_id)

      if (success) {
        setState({
          isDisconnecting: false,
          error: null,
        })
        return true
      } else {
        setState({
          isDisconnecting: false,
          error: "device.connection.disconnectMaxRetries",
        })
        return false
      }
    } catch (error) {
      console.error("❌ [DISCONNECTION] Error al iniciar desconexión:", error)
      setState({
        isDisconnecting: false,
        error: error instanceof Error ? error.message : "device.connection.disconnectError",
      })
      return false
    }
  }, [])

  /**
   * Resetear el estado de la desconexión
   */
  const resetDisconnection = useCallback(() => {
    setState({
      isDisconnecting: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    disconnectDevice,
    resetDisconnection,
  }
}
