"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeInitializer() {
  const { setTheme, resolvedTheme } = useTheme()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Only run this once
    if (initialized) return

    // Verificar si el tema está guardado en localStorage
    const savedTheme = localStorage.getItem("theme")

    if (!savedTheme || savedTheme === "system") {
      // Si no hay tema guardado o está en "system", detectar el tema del sistema
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

      // Aplicar el tema del sistema directamente al DOM
      if (systemTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }

      // Asegurarse de que next-themes sepa que estamos usando el tema del sistema
      setTheme("system")
    } else {
      // Si hay un tema guardado, asegurarse de que se aplique
      setTheme(savedTheme)
    }

    setInitialized(true)
  }, [setTheme, initialized])

  return null
}
