import http from "../../utils/http";
import type { TourTypeAdminParams } from "../types/tourTypeAdmin";

export const tourTypeAdminApi = {
  getAllTours: (params: TourTypeAdminParams) => {
    return http.get("/admin/tour-types/select", { params });
  },
};

import type {
  TourTypeAdmin,
  TourTypeAdminListParams,
  TourTypeDetailAdmin,
  TourTypeSave,
} from "../types/tourTypeAdmin";

export const tourTypeAdminApi1 = {
  // Dùng cho form tạo tour (combobox loại tour)
  getTourTypesForSelect() {
    // lấy all, không phân trang
    return http.get<TourTypeAdmin[]>("admin/tour-types/all");
  },

  // Dùng cho màn Manage TourType (phân trang + search)
  getAdminTourTypes(params: TourTypeAdminListParams) {
    return http.get<{
      content: TourTypeAdmin[];
      totalPages: number;
      number: number; // current page index (0-based)
    }>("admin/tour-types", {
      params,
    });
  },

  getTourTypeById(id: string) {
    return http.get<TourTypeDetailAdmin>(`/admin/tour-types/${id}`);
  },

  createTourType(data: TourTypeSave) {
    return http.post<TourTypeAdmin>("/admin/tour-types", data);
  },

  updateTourType(id: string, data: TourTypeSave) {
    return http.put<TourTypeAdmin>(`/admin/tour-types/${id}`, data);
  },

  deleteTourType(id: string) {
    return http.delete<void>(`/admin/tour-types/${id}`);
  },
};

