import http from "../../utils/http";
import type {
  BookingAdmin,
  BookingAdminListParams,
  BookingDetailAdmin,
  BookingStatsAdmin,
  PageResponse,
} from "../types/bookingAdmin";
import type { TourParticipants } from "../types/tourAdmin";

export const bookingAdminApi = {
  getAdminBookings: (params: BookingAdminListParams) =>
    http.get<PageResponse<BookingAdmin>>("/admin/bookings", { params }),

  getBookingStats: (
    params: Pick<BookingAdminListParams, "fromDate" | "toDate">
  ) => http.get<BookingStatsAdmin>("/admin/bookings/stats", { params }),

  exportBookings: (params: BookingAdminListParams) =>
    http.get("/admin/bookings/export", {
      params,
      responseType: "blob",
    }),

  processCancel: () => http.post<number>("/admin/bookings/cancel/process"),

  getBookingDetail: (id: string) =>
    http.get<BookingDetailAdmin>(`/admin/bookings/${id}`),

  getParticipantsByTour: (tourId: string) =>
    http.get<TourParticipants>("/admin/bookings/participants-by-tour", {
      params: { tourId },
    }),

  exportParticipantsByTour: (tourId: string) =>
    http.get(`/admin/bookings/tours/${tourId}/participants/export`, {
      responseType: "blob",
    }),

  // Lấy danh sách booking đã hủy
  getCanceledBookings: (params: { page: number; size: number }) =>
    http.get("/admin/bookings/canceled", { params }),

  // duyệt hủy
  approveCancel: (id: string) =>
    http.post<void>(`/admin/bookings/${id}/cancel`),
  approveCancelBooking: (id: number) => {
    // Body để rỗng {}, vì backend chỉ cần ID trên URL
    return http.put<any>(`admin/bookings/${id}/cancel`, {});
  },
  keepBooking: (id: string) =>
    http.put<void>(`/admin/bookings/${id}/keep`, {}),
  markRefunded: (id: string) =>
    http.put<void>(`/admin/bookings/${id}/refund`, {}),
};

