// src/admin/types/promotionAdmin.ts

export interface PromotionAdmin {
  discountType: string;
  promotionID: string;
  // (SỬA) Dùng 'title' từ backend làm mã khuyến mãi
  title: string;
  description: string;
  // (SỬA) Dùng discountPercentage (int) và discountAmount (Double)
  discountPercentage: number;
  discountAmount: number | null;
  limitUsage: number;
  currentUsage: number;
  // (SỬA) Ngày tháng là string, cần format
  startDate: string;
  endDate: string;
  // (SỬA) Status
  status: "ACTIVE" | "PENDING" | "EXPIRED" | string;

  // (GIỮ LẠI) Trường giả định vì không có trong Entity Java (cần backend cung cấp)
  targetType: "ALL_TOURS" | "SPECIFIC_TOUR_TYPE" | "SPECIFIC_TOUR" | string;
}
export interface PromotionSave {
  title: string;
  description: string;
  discountPercentage: number;
  discountAmount: number | null;
  limitUsage: number;
  startDate: string;
  endDate: string;
  status: string; // "ACTIVE" | "INACTIVE" | "EXPIRED"
}

export type PromotionDetailAdmin = PromotionAdmin;
export interface PromotionListAdmin {
  content: PromotionAdmin[];
  totalPages: number;
  totalElements: number;
  number: number; // Trang hiện tại (0-indexed)
  size: number;
  // ... (Các trường phân trang khác)
}

export type PromotionAdminApiResponse = PromotionListAdmin;

export interface PromotionListAdminParams {
  page?: number | string;
  size?: number | string;
  search?: string; // Tìm kiếm theo code/name
  status?: "ACTIVE" | "PENDING" | "EXPIRED" | string;
  discountType?: "PERCENTAGE" | "FIXED_AMOUNT" | string;
}

// Khuyến mãi đơn giản cho combobox
export interface PromotionSimple {
  promotionID: string;
  title: string;
}

