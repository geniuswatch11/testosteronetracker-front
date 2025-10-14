import { useState, useEffect } from "react"

/**
 * Hook para controlar cuándo mostrar el modal de preguntas diarias
 * Se muestra una vez al día, a menos que el usuario lo cancele
 */
export function useDailyQuestions() {
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    const checkShouldShow = () => {
      const today = new Date().toISOString().split("T")[0]
      
      // Verificar si ya se completó hoy
      const lastCompleted = localStorage.getItem("dailyQuestions_completed")
      if (lastCompleted === today) {
        return false
      }

      // Verificar si el usuario lo canceló hoy
      const lastSkipped = localStorage.getItem("dailyQuestions_skipped")
      if (lastSkipped === today) {
        return false
      }

      // Verificar si el dispositivo está conectado
      const isDeviceConnected = localStorage.getItem("spike_connect") === "true"
      if (!isDeviceConnected) {
        return false
      }

      return true
    }

    // Esperar 2 segundos después de cargar la página para mostrar el modal
    const timer = setTimeout(() => {
      setShouldShow(checkShouldShow())
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const markAsCompleted = () => {
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem("dailyQuestions_completed", today)
    setShouldShow(false)
  }

  const close = () => {
    setShouldShow(false)
  }

  return {
    shouldShow,
    markAsCompleted,
    close,
  }
}
