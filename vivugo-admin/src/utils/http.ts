import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { toast } from 'react-toastify'
import { clearLS, getAccessTokenFromLS, saveAccessTokenToLS, setProfileToLS } from './auth'
import type { AuthResponse } from '../types/auth.type'
import type { SimpleProfile } from '../types/user.type'

const normalizeApiBaseUrl = (value = 'http://localhost:8081/api/') => {
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
        // CẢI TIẾN 1: CHỈ CHẶN CÁC REQUEST POST, PUT, DELETE (Chat AI, Đặt tour, Login...)
        // Bỏ qua chặn đối với method GET (để load trang thoải mái)
        if (config.method && config.method.toLowerCase() !== 'get') {
          const now = Date.now()
          const ONE_MINUTE = 60 * 1000

          // Dọn dẹp mốc thời gian cũ hơn 1 phút
          this.requestTimestamps = this.requestTimestamps.filter(
            (timestamp) => now - timestamp < ONE_MINUTE
          )

          // Chặn nếu vượt quá 30x lần/phút
          if (this.requestTimestamps.length >= 30) {
            toast.warning('Bạn thao tác gửi dữ liệu quá nhanh! Vui lòng đợi 1 phút.', {
              toastId: 'rate-limit-warning'
            })

            // Hủy request ngay lập tức
            return Promise.reject(new axios.Cancel('Rate limit exceeded'))
          }

          // Ghi nhận thời gian của request hợp lệ này
          this.requestTimestamps.push(now)
        }

        // Gắn token bình thường
        if (this.accessToken && config.headers) {
          config.headers.Authorization = this.accessToken
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Interceptor xử lý sau khi nhận response
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

        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http

