"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SynchronizingLoading } from "@/components/ui/synchronizing-loading"
import { useLanguage } from "@/lib/i18n/language-context"
import { spikeApi } from "@/lib/api/spike"
import toast from "react-hot-toast"
import Modal from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

const MAX_RETRIES = 3
const POLLING_INTERVAL = 3000 // 3 segundos

function SynchronizingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  const taskId = searchParams.get("task_id")
  const provider = searchParams.get("provider")
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!taskId) {
      toast.error(t("device.connection.initError"))
      router.push("/settings")
      return
    }

    let retryCount = 0
    let pollingInterval: NodeJS.Timeout

    const pollTaskStatus = async () => {
      try {
        const response = await spikeApi.getTaskStatus(taskId)
        const { status } = response.data

        if (status === "RETRY") {
          retryCount += 1

          if (retryCount >= MAX_RETRIES) {
            clearInterval(pollingInterval)
            setErrorMessage(t("device.connection.maxRetriesReached"))
            setShowErrorModal(true)
            return
          }
        } else if (status === "FAILURE") {
          clearInterval(pollingInterval)
          setErrorMessage(t("device.connection.failed"))
          setShowErrorModal(true)
        } else if (status === "SUCCESS") {
          clearInterval(pollingInterval)

          // Paso 3: Obtener los resultados de la tarea
          try {
            console.log("🔵 [PASO 3] Obteniendo resultados de la tarea:", taskId)
            const resultsResponse = await spikeApi.getTaskResults(taskId)
            console.log("🔵 [PASO 3] Respuesta completa:", resultsResponse)
            console.log("🔵 [PASO 3] Data:", resultsResponse.data)
            console.log("🔵 [PASO 3] Result:", resultsResponse.data.result)
            
            const { integration_url, spike_id, provider } = resultsResponse.data.result.data
            console.log("🔵 [PASO 3] Integration URL:", integration_url)
            console.log("🔵 [PASO 3] Spike ID:", spike_id)
            console.log("🔵 [PASO 3] Provider:", provider)

            // Guardar el spike_id en localStorage para usarlo después
            localStorage.setItem("spike_id", spike_id.toString())
            localStorage.setItem("spike_provider", provider)

            // Redirigir al usuario a la URL de integración del proveedor
            console.log("🔵 [PASO 3] Redirigiendo a:", integration_url)
            window.location.href = integration_url
          } catch (error) {
            console.error("❌ [PASO 3] Error:", error)
            setErrorMessage(t("device.connection.resultsError"))
            setShowErrorModal(true)
          }
        }
        // Si es PENDING, continuar con el polling
      } catch (error) {
        clearInterval(pollingInterval)
        setErrorMessage(t("device.connection.statusError"))
        setShowErrorModal(true)
      }
    }

    // Iniciar el polling
    pollingInterval = setInterval(pollTaskStatus, POLLING_INTERVAL)

    // Hacer la primera consulta inmediatamente
    pollTaskStatus()

    // Cleanup al desmontar
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [taskId, router, t])

  const handleErrorModalClose = () => {
    setShowErrorModal(false)
    router.push("/settings")
  }

  return (
    <>
      <SynchronizingLoading
        title={t("device.connection.synchronizing")}
        description={t("device.connection.synchronizingDescription")}
      />
      
      <Modal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        title={t("device.connection.error")}
        maxWidth="md"
        footer={
          <Button
            onClick={handleErrorModalClose}
            className="w-full bg-danger-600 hover:bg-danger-500 text-white"
          >
            {t("common.close")}
          </Button>
        }
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-danger-600/20 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-danger-600" />
          </div>
          <p className="text-white text-lg">{errorMessage}</p>
          <p className="text-neutral-400 text-sm">
            {t("device.connection.tryAgain")}
          </p>
        </div>
      </Modal>
    </>
  )
}

export default function SynchronizingPage() {
  return (
    <Suspense
      fallback={
        <SynchronizingLoading
          title="Loading..."
          description="Please wait while we prepare your connection."
        />
      }
    >
      <SynchronizingContent />
    </Suspense>
  )
}
