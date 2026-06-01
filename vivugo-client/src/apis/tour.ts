// frontend-demo/src/apis/tour.ts
import http from '../utils/http'
// (CẬP NHẬT) Import thêm TourListParams
import type { Tour, TourApiResponse, TourListParams, TourDetails, RecommendationResponse } from '../types/tour'

export const tourApi = {
  getFeaturedTours: () => {
    return http.get<TourApiResponse>('tours', {
      params: { size: 6, sort: 'ranking,asc' }
    })
  },

  getTrendingTours: (size = 8) => {
    return http.get<Tour[]>('tours/trending', { params: { size } })
  },

  getDealTours: (size = 8) => {
    return http.get<Tour[]>('tours/deals', { params: { size } })
  },

  getTours: (params: TourListParams) => {
    return http.get<TourApiResponse>('tours', { params })
  },

  getTourDetails: (id: string) => {
    return http.get<TourDetails>(`tours/${id}`)
  },

  trackTourView: (id: string, sessionId: string) => {
    return http.post<void>(`tours/${id}/view`, { sessionId })
  },

  getPersonalizedRecommendations: (sessionId: string, size = 8) => {
    return http.get<RecommendationResponse>('recommendations/personalized', {
      params: { sessionId, size }
    })
  }
}
