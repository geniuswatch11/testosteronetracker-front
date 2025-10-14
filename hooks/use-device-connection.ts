import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { spikeApi } from "@/lib/api/spike"

interface UseDeviceConnectionState {
  isLoading: boolean
  error: string | null
}

interface UseDeviceConnectionReturn extends UseDeviceConnectionState {
  connectDevice: (provider: string) => Promise<void>
  resetConnection: () => void
}

/**
 * Hook personalizado para iniciar el proceso de conexión de dispositivos
 * Redirige a la página de sincronización donde se maneja el polling
 */
export function useDeviceConnection(): UseDeviceConnectionReturn {
  const router = useRouter()
  const [state, setState] = useState<UseDeviceConnectionState>({
    isLoading: false,
    error: null,
  })

  /**
   * Paso 1: Iniciar el proceso de conexión del dispositivo
   * Redirige a /synchronizing con el task_id
   */
  const connectDevice = useCallback(
    async (provider: string) => {
      setState({
        isLoading: true,
        error: null,
      })

      try {
        // Paso 1: Iniciar la integración
        const response = await spikeApi.addDevice({ provider })
        const { task_id } = response.data

        // Redirigir a la página de sincronización con el task_id
        router.push(`/synchronizing?task_id=${task_id}&provider=${provider}`)
      } catch (error) {
        setState({
          isLoading: false,
          error: error instanceof Error ? error.message : "device.connection.initError",
        })
      }
    },
    [router]
  )

  /**
   * Resetear el estado de la conexión
   */
  const resetConnection = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    connectDevice,
    resetConnection,
  }
}
