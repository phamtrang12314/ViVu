// frontend-demo/src/apis/tour.ts
import http from '../utils/http'
// (CẬP NHẬT) Import thêm TourListParams
import type { TourApiResponse, TourListParams, TourDetails } from '../types/tour'

export const tourApi = {
  getFeaturedTours: () => {
    // Lấy 6 tour đầu tiên, sắp xếp theo ranking (như trong TourService)
    return http.get<TourApiResponse>('tours', {
      params: {
        size: 6,
        sort: 'ranking,asc'
      }
    })
  },

  // (MỚI) Hàm lấy tất cả tour với bộ lọc và phân trang
  getTours: (params: TourListParams) => {
    // Truyền thẳng các params nhận được vào API
    return http.get<TourApiResponse>('tours', {
      params: params
    })
  },
  getTourDetails: (id: string) => {
    return http.get<TourDetails>(`tours/${id}`)
  }
}

