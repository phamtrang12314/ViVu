// src/admin/screens/PromotionScreen/FormPromotionScreen.tsx

import React, { useState, useEffect } from "react";
// Bỏ useParams, useNavigate
import { useMutation, useQuery } from "@tanstack/react-query";
import { promotionAdminApi } from "../../apis/promotionAdmin.api";
import type {
  PromotionDetailAdmin,
  PromotionSave,
} from "../../types/promotionAdmin";
import { formatCurrency } from "../../../utils/utils"; // Import formatCurrency từ utils/utils

// (MỚI) Định nghĩa Props
interface FormPromotionProps {
  promotionId?: string; // ID nếu là chế độ chỉnh sửa
  onClose: () => void; // Hàm đóng modal và refresh danh sách
}

// ==== Cấu trúc Form State ====
type PromotionForm = PromotionSave & {
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "NONE";
};

type FormErrors = {
  [K in keyof PromotionForm]?: string;
} & { form?: string };

// ==== Constants ====
const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "INACTIVE", label: "Không hoạt động" },
  { value: "EXPIRED", label: "Hết hạn" },
];

const inputBase =
  "w-full border border-gray-300 rounded-xl px-3 py-3 text-base " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

// ==== Helper VND ====
const parseVND = (raw: string): number | null => {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  return Number(digits);
};

const formatVND = (value: number | null): string => {
  if (value === null || isNaN(Number(value))) return "";
  // Sửa lỗi: dùng hàm formatCurrency đã import
  return formatCurrency(Number(value));
};

// (MỚI) Helper để format date ISO string thành YYYY-MM-DD cho input type="date"
const formatDateToInput = (isoString: string | null | undefined): string => {
  if (!isoString) return "";
  try {
    // Lấy phần YYYY-MM-DD từ chuỗi ISO 8601
    return isoString.split("T")[0];
  } catch {
    return "";
  }
};

// ==== Component Chính ====
// (SỬA): Nhận props thay vì dùng useParams và useNavigate
export default function FormPromotionScreen({
  promotionId,
  onClose,
}: FormPromotionProps) {
  const isEdit = Boolean(promotionId);

  const [form, setForm] = useState<PromotionForm>({
    title: "",
    description: "",
    discountPercentage: 0,
    discountAmount: null,
    limitUsage: 0,
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    discountType: "NONE",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Query để lấy dữ liệu chỉnh sửa
  const {
    data: promotionDetail,
    isLoading: loadingPromotion,
    isError, // THÊM isError để kiểm tra lỗi tải dữ liệu
  } = useQuery<PromotionDetailAdmin>({
    queryKey: ["promotion-detail", promotionId],
    queryFn: () =>
      promotionAdminApi
        .getPromotionById(promotionId as string)
        .then((res) => res.data),
    enabled: isEdit && !!promotionId,
  });

  // Mutate để tạo/cập nhật
  const createMutation = useMutation({
    mutationFn: promotionAdminApi.createPromotion,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PromotionSave }) =>
      promotionAdminApi.updatePromotion(id, data),
  });

  // Fill form khi edit
  useEffect(() => {
    if (!promotionDetail) return;

    const detail = promotionDetail;
    let type: PromotionForm["discountType"] = "NONE";

    if (detail.discountPercentage > 0) {
      type = "PERCENTAGE";
    } else if (detail.discountAmount && detail.discountAmount > 0) {
      type = "FIXED_AMOUNT";
    }

    setForm({
      title: detail.title ?? "",
      description: detail.description ?? "",
      discountPercentage: detail.discountPercentage ?? 0,
      discountAmount: detail.discountAmount ?? null,
      limitUsage: detail.limitUsage ?? 0,
      // (FIX) Format ngày tháng sang YYYY-MM-DD cho input type="date"
      startDate: formatDateToInput(detail.startDate),
      endDate: formatDateToInput(detail.endDate),
      status: detail.status ?? "ACTIVE",
      discountType: type,
    });
    setErrors({});
  }, [promotionDetail]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const isNumericField = ["discountPercentage", "limitUsage"].includes(name);

    if (isNumericField) {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : Number(value),
      }));
    } else if (name === "discountAmount") {
      const numeric = parseVND(value);
      setForm((prev) => ({
        ...prev,
        discountAmount: numeric,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const handleDiscountTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const type = e.target.value as PromotionForm["discountType"];

    setForm((prev) => ({
      ...prev,
      discountType: type,
      discountPercentage: type === "PERCENTAGE" ? prev.discountPercentage : 0,
      discountAmount: type === "FIXED_AMOUNT" ? prev.discountAmount : null,
    }));
    setErrors((prev) => ({
      ...prev,
      discountType: undefined,
      discountPercentage: undefined,
      discountAmount: undefined,
      form: undefined,
    }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.title.trim()) newErrors.title = "Mã khuyến mãi là bắt buộc";
    if (!form.description.trim()) newErrors.description = "Mô tả là bắt buộc";

    if (form.discountType === "NONE") {
      newErrors.discountType = "Chọn loại giảm giá";
    } else if (form.discountType === "PERCENTAGE") {
      if (form.discountPercentage <= 0 || form.discountPercentage > 100) {
        newErrors.discountPercentage = "Giảm % phải từ 1 đến 100";
      }
    } else if (form.discountType === "FIXED_AMOUNT") {
      if (form.discountAmount === null || form.discountAmount <= 0) {
        newErrors.discountAmount = "Giảm tiền cố định phải > 0";
      }
    }

    if (form.limitUsage < 0) newErrors.limitUsage = "Không thể là số âm";
    if (!form.startDate) newErrors.startDate = "Chọn ngày bắt đầu";
    if (!form.endDate) {
      newErrors.endDate = "Chọn ngày kết thúc";
    } else if (form.startDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end <= start) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload: PromotionSave = {
      title: form.title.trim(),
      description: form.description.trim(),
      limitUsage: form.limitUsage,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
      discountPercentage:
        form.discountType === "PERCENTAGE" ? form.discountPercentage : 0,
      discountAmount:
        form.discountType === "FIXED_AMOUNT" ? form.discountAmount : null,
    };

    try {
      if (isEdit && promotionId) {
        await updateMutation.mutateAsync({ id: promotionId, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose(); // (SỬA): Đóng modal khi thành công
    } catch (error: any) {
      // (CẬP NHẬT) Cải tiến phần xử lý lỗi để hiển thị lỗi chi tiết hơn từ Backend
      const errorMessage =
        error?.response?.data?.message || // Lấy thông báo lỗi chính từ API
        error?.message || // Lấy thông báo lỗi Axios/Mạng
        "Lỗi lưu khuyến mãi. Vui lòng kiểm tra lại dữ liệu và Network tab."; // Lỗi mặc định

      console.error("Lỗi API:", error?.response?.data || error); // Log lỗi chi tiết ra console

      setErrors((prev) => ({
        ...prev,
        form: errorMessage,
      }));
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // (SỬA LAYOUT CHÍNH): THÊM h-full và flex flex-col ở đây
  return (
    <div className="bg-white text-base w-full h-full flex flex-col">
      {/* Header Modal */}
      <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            {isEdit ? "Chỉnh sửa Khuyến mãi" : "Tạo Khuyến mãi mới"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Cấu hình mã, thời gian và giá trị ưu đãi.
          </p>
        </div>
        {/* Nút đóng modal */}
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {isEdit && loadingPromotion ? (
        // HIỂN THỊ LOADING: SỬ DỤNG flex-1 để div loading chiếm hết chiều cao còn lại
        <div className="flex-1 flex items-center justify-center p-12 text-base">
          Đang tải dữ liệu khuyến mãi...
        </div>
      ) : isEdit && (isError || !promotionDetail) ? (
        // HIỂN THỊ LỖI KHI LOAD XONG NHƯNG THẤT BẠI
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-base">
          <div className="text-red-500 font-semibold mb-4 text-center">
            {isError
              ? "Lỗi kết nối hoặc tải dữ liệu thất bại. Vui lòng thử lại."
              : "Không tìm thấy khuyến mãi này."}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-gray-300 text-base text-gray-700 hover:bg-gray-100"
          >
            Đóng
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full flex-1 overflow-hidden"
        >
          {/* Nội dung form có thể cuộn */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {errors.form && (
              <div className="mb-4 text-sm text-red-500">{errors.form}</div>
            )}

            {/* Thông tin cơ bản */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Thông tin mã ưu đãi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Mã khuyến mãi (Code)
                  </label>
                  {errors.title && (
                    <p className="text-xs text-red-500 mb-1">{errors.title}</p>
                  )}
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Ví dụ: SUMMER10, GIAM200K"
                    className={inputBase}
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Số lần sử dụng tối đa
                  </label>
                  {errors.limitUsage && (
                    <p className="text-xs text-red-500 mb-1">
                      {errors.limitUsage}
                    </p>
                  )}
                  <input
                    type="number"
                    min={0}
                    name="limitUsage"
                    value={form.limitUsage === 0 ? "" : form.limitUsage}
                    onChange={handleChange}
                    placeholder="0 (Không giới hạn)"
                    className={inputBase}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Mô tả
                </label>
                {errors.description && (
                  <p className="text-xs text-red-500 mb-1">
                    {errors.description}
                  </p>
                )}
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Mô tả ngắn gọn về ưu đãi"
                  className={inputBase + " min-h-[100px] resize-y"}
                  disabled={isSaving}
                />
              </div>
            </section>

            {/* Giá trị và loại khuyến mãi */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Giá trị ưu đãi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Loại giảm giá
                  </label>
                  {errors.discountType && (
                    <p className="text-xs text-red-500 mb-1">
                      {errors.discountType}
                    </p>
                  )}
                  <select
                    name="discountType"
                    value={form.discountType}
                    onChange={handleDiscountTypeChange}
                    className={inputBase}
                    disabled={isSaving}
                  >
                    <option value="NONE">Chọn loại</option>
                    <option value="PERCENTAGE">Giảm theo Phần trăm (%)</option>
                    <option value="FIXED_AMOUNT">
                      Giảm theo Số tiền cố định
                    </option>
                  </select>
                </div>

                {form.discountType === "PERCENTAGE" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Phần trăm giảm (%)
                    </label>
                    {errors.discountPercentage && (
                      <p className="text-xs text-red-500 mb-1">
                        {errors.discountPercentage}
                      </p>
                    )}
                    <input
                      type="number"
                      min={1}
                      max={100}
                      name="discountPercentage"
                      value={form.discountPercentage || ""}
                      onChange={handleChange}
                      placeholder="1 - 100"
                      className={inputBase}
                      disabled={isSaving}
                    />
                  </div>
                )}

                {form.discountType === "FIXED_AMOUNT" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Số tiền giảm cố định (VNĐ)
                    </label>
                    {errors.discountAmount && (
                      <p className="text-xs text-red-500 mb-1">
                        {errors.discountAmount}
                      </p>
                    )}
                    <input
                      type="text"
                      name="discountAmount"
                      value={formatVND(form.discountAmount)}
                      onChange={handleChange}
                      placeholder="Ví dụ: 200,000"
                      className={inputBase}
                      inputMode="numeric"
                      disabled={isSaving}
                    />
                  </div>
                )}

                {form.discountType === "NONE" && (
                  <div className="md:col-span-2 text-gray-500 flex items-center pt-2">
                    Vui lòng chọn loại giảm giá.
                  </div>
                )}
              </div>
            </section>

            {/* Thời gian & Trạng thái */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Thời gian và Trạng thái
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Ngày bắt đầu
                  </label>
                  {errors.startDate && (
                    <p className="text-xs text-red-500 mb-1">
                      {errors.startDate}
                    </p>
                  )}
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className={inputBase}
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Ngày kết thúc
                  </label>
                  {errors.endDate && (
                    <p className="text-xs text-red-500 mb-1">
                      {errors.endDate}
                    </p>
                  )}
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className={inputBase}
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputBase}
                    disabled={isSaving}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          </div>

          {/* Actions (Footer Modal) */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose} // Gọi onClose khi hủy
              className="px-6 py-3 rounded-xl border border-gray-300 text-base text-gray-700"
              disabled={isSaving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-7 py-3 rounded-xl bg-blue-600 text-base text-white font-semibold flex items-center gap-2 ${
                isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
              disabled={isSaving}
            >
              {isSaving && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isEdit ? "Lưu thay đổi" : "Tạo khuyến mãi"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

