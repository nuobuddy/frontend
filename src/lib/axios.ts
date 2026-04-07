import axios from 'axios'
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import router from '@/router'

// Backend envelope type: all responses are wrapped in { status, data, message }
interface ApiEnvelope<T = unknown> {
  status: number
  data: T
  message: string
}

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_API_BASE ?? '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor - Unwrap backend envelope and handle errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Backend wraps all responses in { status, data, message }
    // Unwrap so that response.data is the inner `data` field directly
    const body = response.data as ApiEnvelope | undefined
    if (body && typeof body === 'object' && 'data' in body) {
      response.data = body.data
    }
    return response
  },
  async (error: AxiosError<ApiEnvelope>) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      await router.push('/login')
    }

    // Extract error message from backend envelope or fallback
    const errorMessage = error.response?.data?.message || error.message || 'Request failed'
    return Promise.reject(new Error(errorMessage))
  },
)

export default axiosInstance
