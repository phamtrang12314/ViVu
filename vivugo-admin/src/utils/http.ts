import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { toast } from 'react-toastify'
import { clearLS, getAccessTokenFromLS, saveAccessTokenToLS, setProfileToLS } from './auth'
import type { AuthResponse } from '../types/auth.type'
import type { SimpleProfile } from '../types/user.type'

const normalizeApiBaseUrl = (value = '/api/') => {
  const cleanedValue = value.trim().replace(/\/+$/, '')
  return cleanedValue.endsWith('/api') ? `${cleanedValue}/` : `${cleanedValue}/api/`
}

class Http {
  instance: AxiosInstance
  private accessToken: string
  private requestTimestamps: number[] = []

  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (typeof config.url === 'string') {
          config.url = config.url.replace(/^\/+/, '')
        }

        if (config.method && config.method.toLowerCase() !== 'get') {
          const now = Date.now()
          const oneMinute = 60 * 1000

          this.requestTimestamps = this.requestTimestamps.filter((timestamp) => now - timestamp < oneMinute)

          if (this.requestTimestamps.length >= 30) {
            toast.warning('Bạn thao tác gửi dữ liệu quá nhanh. Vui lòng đợi 1 phút.', {
              toastId: 'rate-limit-warning'
            })
            return Promise.reject(new axios.Cancel('Rate limit exceeded'))
          }

          this.requestTimestamps.push(now)
        }

        if (this.accessToken && config.headers) {
          config.headers.Authorization = this.accessToken
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config

        if (url === 'auth/login' || url === 'auth/admin/login' || url === 'auth/register') {
          const data = response.data as AuthResponse
          this.accessToken = data.token
          saveAccessTokenToLS(this.accessToken)
          const simpleProfile: SimpleProfile = {
            userID: data.userID,
            email: data.email,
            role: data.role
          }
          setProfileToLS(simpleProfile)
        } else if (url === 'auth/logout') {
          this.accessToken = ''
          clearLS()
        }

        return response
      },
      (error) => {
        if (axios.isCancel(error)) {
          return Promise.reject(new Error('Request bị chặn do thao tác quá nhanh'))
        }

        const status = error.response?.status
        if ((status === 401 || status === 403) && !error.config?.url?.includes('auth/admin/login')) {
          this.accessToken = ''
          clearLS()
          toast.error('Phiên quản trị đã hết hạn. Vui lòng đăng nhập lại.', {
            toastId: 'admin-session-expired'
          })
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
        }

        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
