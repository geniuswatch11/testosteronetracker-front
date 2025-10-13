"use client"

import { useState, useEffect } from "react"
import { authApi, type UserProfile } from "@/lib/api/auth"
import { useRouter } from "next/navigation"

interface UseAuthReturn {
  user: UserProfile | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  spikeConnected: boolean
  isComplete: boolean
  logout: () => void
  refreshUser: () => Promise<void>
}

/**
 * Hook para manejar la autenticación del usuario
 * Implementa Indirect Data Fetching pattern
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
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

      const profile = await authApi.getUserProfile()
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

  const logout = () => {
    authApi.logout()
    setUser(null)
    setSpikeConnected(false)
    setIsComplete(false)
    router.push("/login")
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
