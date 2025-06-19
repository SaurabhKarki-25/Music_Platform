"use client"

import { useState, useCallback } from "react"
import { handleApiError, type ApiError } from "../utils/errorHandler"

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>
  reset: () => void
}

export function useApi<T = any>(apiFunction: (...args: any[]) => Promise<any>): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const response = await apiFunction(...args)
        const data = response.data?.data || response.data

        setState({
          data,
          loading: false,
          error: null,
        })

        return data
      } catch (error) {
        const apiError = handleApiError(error)
        setState({
          data: null,
          loading: false,
          error: apiError,
        })
        return null
      }
    },
    [apiFunction],
  )

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
