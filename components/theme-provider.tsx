"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Forzar la actualización del tema cuando cambia el tema del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      // Forzar una actualización del tema si está en modo "system"
      const currentTheme = localStorage.getItem("theme")
      if (!currentTheme || currentTheme === "system") {
        // Aplicar el tema del sistema directamente
        const isDark = mediaQuery.matches
        document.documentElement.classList.toggle("dark", isDark)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      enableColorScheme={true}
      storageKey="theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
