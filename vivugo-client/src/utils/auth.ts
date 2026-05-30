import type { SimpleProfile } from '../types/user.type'

export const saveAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const getProfileFromLS = (): SimpleProfile | null => {
  const result = localStorage.getItem('profile')

  if (!result || result === 'undefined') {
    localStorage.removeItem('profile')
    return null
  }

  try {
    return JSON.parse(result)
  } catch (error) {
    console.error('Lỗi phân tích JSON từ LocalStorage (profile):', error)
    localStorage.removeItem('profile')
    return null
  }
}

export const setProfileToLS = (profile: SimpleProfile) => {
  if (profile) {
    localStorage.setItem('profile', JSON.stringify(profile))
  } else {
    localStorage.removeItem('profile')
  }
}

