"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api/auth"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticación
    const checkAuth = () => {
      const isAuth = authApi.isAuthenticated()
      setIsAuthenticated(isAuth)
      setIsLoading(false)

      if (!isAuth) {
        router.push("/login")
      }
    }

    checkAuth()

    // Verificar cambios en localStorage
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [router])

  // Mostrar nada mientras se verifica la autenticación
  if (isLoading) {
    return null
  }

  // Si no está autenticado, no renderizar nada mientras se redirecciona
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
