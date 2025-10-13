"use client"

import { useState, useCallback } from "react"

interface UseAsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

interface UseAsyncReturn<T, Args extends any[]> extends UseAsyncState<T> {
  execute: (...args: Args) => Promise<T | null>
  reset: () => void
}

/**
 * Hook genérico para manejar operaciones asíncronas
 * Implementa Indirect Data Fetching pattern
 * 
 * @example
 * const { data, isLoading, error, execute } = useAsync(authApi.login)
 * await execute(email, password)
 */
export function useAsync<T, Args extends any[] = []>(
  asyncFunction: (...args: Args) => Promise<T>
): UseAsyncReturn<T, Args> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState({ data: null, isLoading: true, error: null })

      try {
        const result = await asyncFunction(...args)
        setState({ data: result, isLoading: false, error: null })
        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred"
        setState({ data: null, isLoading: false, error: errorMessage })
        return null
      }
    },
    [asyncFunction]
  )

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
