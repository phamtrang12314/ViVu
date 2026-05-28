// src/admin/apis/promotionAdmin.api.ts

import http from "../../utils/http";
import type {
  PromotionSimple,
  PromotionAdminApiResponse,
  PromotionListAdminParams,
  PromotionDetailAdmin, // Cần import thêm
  PromotionSave, // Cần import thêm
} from "../types/promotionAdmin";

const URL = "/admin/promotions"; // Định nghĩa URL gốc

export const promotionAdminApi = {
  // Dùng cho form tạo tour (combobox khuyến mãi)
  getSimplePromotions: () => http.get<PromotionSimple[]>(`${URL}/simple`),

  // [BỔ SUNG] Dùng cho màn Manage Promotion (phân trang + search + filter)
  getAllPromotions: (params: PromotionListAdminParams) =>
    http.get<PromotionAdminApiResponse>(URL, { params }), // Đây là API bị thiếu

  // [BỔ SUNG] Dùng cho FormPromotionScreen để lấy chi tiết
  getPromotionById: (id: string) =>
    http.get<PromotionDetailAdmin>(`${URL}/${id}`),

  // [BỔ SUNG]
  createPromotion: (data: PromotionSave) =>
    http.post<PromotionDetailAdmin>(URL, data),

  // [BỔ SUNG]
  updatePromotion: (id: string, data: PromotionSave) =>
    http.put<PromotionDetailAdmin>(`${URL}/${id}`, data),

  deletePromotion: (id: string) =>
    http.delete<void>(`${URL}/${id}`),
};

