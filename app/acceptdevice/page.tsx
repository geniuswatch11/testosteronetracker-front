"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Cookies from "js-cookie"
import { spikeApi } from "@/lib/api/spike"
import { useLanguage } from "@/lib/i18n/language-context"
import { SynchronizingLoading } from "@/components/ui/synchronizing-loading"

function AcceptDeviceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(true)
  const [success, setSuccess] = useState<boolean | null>(null)

  useEffect(() => {
    const processCallback = async () => {
      console.log("🟢 [ACCEPTDEVICE] Iniciando procesamiento del callback")
      console.log("🟢 [ACCEPTDEVICE] URL completa:", typeof window !== "undefined" ? window.location.href : "")
      
      // Obtener TODOS los parámetros de la URL
      const allParams: Record<string, string> = {}
      searchParams.forEach((value, key) => {
        allParams[key] = value
      })
      console.log("🟢 [ACCEPTDEVICE] Todos los parámetros recibidos:", allParams)
      
      // Spike envía: provider_slug y user_id cuando es exitoso
      // O puede enviar: state en caso de error
      const providerSlug = searchParams.get("provider_slug")
      const userId = searchParams.get("user_id")
      const state = searchParams.get("state")
      const error = searchParams.get("error")
      
      console.log("🟢 [ACCEPTDEVICE] Parámetros de Spike:")
      console.log("  - provider_slug:", providerSlug)
      console.log("  - user_id:", userId)
      console.log("  - state:", state)
      console.log("  - error:", error)

      // Determinar si el consentimiento fue dado
      // Éxito: provider_slug y user_id están presentes y no hay error
      const consentGiven = !!(providerSlug && userId) && !error
      
      console.log("🟢 [ACCEPTDEVICE] Consent given determinado:", consentGiven)

      try {
        console.log("🟢 [ACCEPTDEVICE] Enviando consent al backend:", { consent_given: consentGiven })
        // Paso 4: Enviar el consentimiento al backend
        const response = await spikeApi.sendConsent({ consent_given: consentGiven })
        console.log("🟢 [ACCEPTDEVICE] Respuesta del backend:", response)
        console.log("🟢 [ACCEPTDEVICE] response.data:", response.data)
        console.log("🟢 [ACCEPTDEVICE] consentGiven:", consentGiven)
        
        // Si el consentimiento fue dado exitosamente, actualizar localStorage y cookies
        if (consentGiven) {
          console.log("🟢 [ACCEPTDEVICE] Actualizando spike_connect en localStorage y cookies")
          localStorage.setItem("spike_connect", "true")
          localStorage.setItem("spike_provider", providerSlug || "")
          
          // Actualizar cookies para que el middleware pueda detectarlo
          Cookies.set("spike_connect", "true", { expires: 365 }) // 1 año
          
          // Actualizar el perfil del usuario en caché
          const cachedUser = localStorage.getItem("userProfile")
          if (cachedUser) {
            const userProfile = JSON.parse(cachedUser)
            userProfile.spike_connect = true
            localStorage.setItem("userProfile", JSON.stringify(userProfile))
          }
          
          console.log("✅ [ACCEPTDEVICE] spike_connect actualizado a true")
        } else {
          console.log("⚠️ [ACCEPTDEVICE] Consent no fue dado, no se actualiza spike_connect")
        }
        
        setSuccess(consentGiven)
      } catch (err) {
        console.error("❌ [ACCEPTDEVICE] Error sending consent:", err)
        setSuccess(false)
      } finally {
        setIsProcessing(false)
      }
    }

    processCallback()
  }, [searchParams])

  // Redirigir después de 3 segundos
  useEffect(() => {
    if (success !== null && !isProcessing) {
      const timer = setTimeout(() => {
        router.push("/dashboard")
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [success, isProcessing, router])

  // Mostrar pantalla de carga mientras se procesa
  if (isProcessing) {
    return (
      <SynchronizingLoading
        title={t("device.connection.processing")}
        description={t("device.connection.processingDescription")}
      />
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo_2.png"
            alt="Genius Testosterone Logo"
            width={120}
            height={120}
            priority
          />
        </div>

        {/* Mensaje de éxito o error */}
        {success ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">{t("device.connection.success")}</h1>
            <p className="text-neutral-400">{t("device.connection.successDescription")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-danger-600 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">{t("device.connection.error")}</h1>
            <p className="text-neutral-400">{t("device.connection.errorDescription")}</p>
          </div>
        )}

        {/* Mensaje de redirección */}
        <div className="pt-4">
          <p className="text-sm text-neutral-500">{t("device.connection.redirecting")}</p>
        </div>
      </div>
    </main>
  )
}

export default function AcceptDevicePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
          <div className="text-white">Loading...</div>
        </main>
      }
    >
      <AcceptDeviceContent />
    </Suspense>
  )
}
