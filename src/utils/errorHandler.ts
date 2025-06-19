import toast from "react-hot-toast"

export interface ApiError {
  message: string
  status?: number
  code?: string
}

export const handleApiError = (error: any): ApiError => {
  let errorMessage = "An unexpected error occurred"
  let status = 500
  let code = "UNKNOWN_ERROR"

  if (error.response) {
    // Server responded with error status
    status = error.response.status
    errorMessage = error.response.data?.message || `Server error (${status})`
    code = error.response.data?.code || `HTTP_${status}`
  } else if (error.request) {
    // Network error
    errorMessage = "Network error. Please check your connection."
    code = "NETWORK_ERROR"
  } else if (error.message) {
    // Other error
    errorMessage = error.message
  }

  // Show toast notification for user-facing errors
  if (status !== 401) {
    // Don't show toast for auth errors (handled by redirect)
    toast.error(errorMessage)
  }

  return { message: errorMessage, status, code }
}

export const handleSuccess = (message: string) => {
  toast.success(message)
}

export const handleInfo = (message: string) => {
  toast(message, {
    icon: "ℹ️",
  })
}
