"use client"

import { useState, useEffect, useCallback } from "react"
import { healthApi, type HealthData } from "@/lib/api/health"

interface UseHealthDataOptions {
  interval?: number
  limit?: number
  autoFetch?: boolean
}

interface UseHealthDataReturn {
  data: HealthData[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  setInterval: (interval: number) => void
}

/**
 * Hook para manejar datos de salud
 * Implementa Indirect Data Fetching pattern
 */
export function useHealthData(options: UseHealthDataOptions = {}): UseHealthDataReturn {
  const {
    interval: initialInterval = 1,
    limit = 12,
    autoFetch = true,
  } = options

  const [data, setData] = useState<HealthData[]>([])
  const [interval, setIntervalState] = useState(initialInterval)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await healthApi.getUserHealthData(interval, limit)
      
      if (response.status === "complete" && response.data) {
        setData(response.data)
      } else {
        setData([])
      }
    } catch (err) {
      console.error("Error fetching health data:", err)
      setError("Failed to load health data")
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [interval, limit])

  const setInterval = useCallback((newInterval: number) => {
    setIntervalState(newInterval)
  }, [])

  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [autoFetch, fetchData])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    setInterval,
  }
}
