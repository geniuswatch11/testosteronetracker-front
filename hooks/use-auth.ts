"use client"

import { useState, useEffect } from "react"
import { authApi } from "@/lib/api/auth"
import { userApi } from "@/lib/api/user"
import type { UserProfileData } from "@/lib/types/api"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface UseAuthReturn {
  user: UserProfileData | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  spikeConnected: boolean
  isComplete: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

/**
 * Hook para manejar la autenticación del usuario
 * Implementa Indirect Data Fetching pattern
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const [user, setUser] = useState<UserProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [spikeConnected, setSpikeConnected] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const loadUser = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!authApi.isAuthenticated()) {
        setUser(null)
        setIsLoading(false)
        return
      }

      const profile = await userApi.getUserProfile()
      setUser(profile)

      // Obtener valores de localStorage/cookies
      const spikeConnect = authApi.getSpikeConnect()
      const complete = authApi.getIsComplete()
      setSpikeConnected(spikeConnect)
      setIsComplete(complete)
    } catch (err) {
      console.error("Error loading user:", err)
      setError("Failed to load user profile")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
      setUser(null)
      setSpikeConnected(false)
      setIsComplete(false)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to logout"
      toast.error(errorMessage)
      // Aún así redirigir al login ya que el localStorage se limpió
      setUser(null)
      setSpikeConnected(false)
      setIsComplete(false)
      router.push("/login")
    }
  }

  const refreshUser = async () => {
    await loadUser()
  }

  useEffect(() => {
    loadUser()
  }, [])

  return {
    user,
    isLoading,
    error,
    isAuthenticated: authApi.isAuthenticated(),
    spikeConnected,
    isComplete,
    logout,
    refreshUser,
  }
}
