import { useState, useCallback } from "react"
import { spikeApi } from "@/lib/api/spike"

interface UseDeviceDisconnectionState {
  isDisconnecting: boolean
  error: string | null
}

interface UseDeviceDisconnectionReturn extends UseDeviceDisconnectionState {
  disconnectDevice: (spikeIdHash: string) => Promise<boolean>
  resetDisconnection: () => void
}

/**
 * Hook personalizado para manejar la desconexión de dispositivos
 */
export function useDeviceDisconnection(): UseDeviceDisconnectionReturn {
  const [state, setState] = useState<UseDeviceDisconnectionState>({
    isDisconnecting: false,
    error: null,
  })

  /**
   * Desconectar el dispositivo usando el spike_id_hash
   * @param spikeIdHash - Hash del dispositivo a desconectar
   * @returns true si la desconexión fue exitosa, false si falló
   */
  const disconnectDevice = useCallback(async (spikeIdHash: string): Promise<boolean> => {
    setState({
      isDisconnecting: true,
      error: null,
    })

    try {
      console.log("🔷 [DISCONNECTION] Iniciando desconexión del dispositivo:", spikeIdHash)
      
      await spikeApi.deleteDevice(spikeIdHash)
      
      console.log("✅ [DISCONNECTION] Dispositivo desconectado exitosamente")
      
      setState({
        isDisconnecting: false,
        error: null,
      })
      
      return true
    } catch (error) {
      console.error("❌ [DISCONNECTION] Error al desconectar dispositivo:", error)
      
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
