import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { tourTypeAdminApi1 } from "../../apis/tourTypeAdmin.api";
import type {
  TourTypeSave,
  TourTypeDetailAdmin,
} from "../../types/tourTypeAdmin";

const inputBase =
  "w-full border border-gray-300 rounded-xl px-3 py-3 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

type FormErrors = {
  [k: string]: string | undefined;
};

const FormTourTypeScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: detail, isLoading } = useQuery({
    queryKey: ["admin-tour-type-detail", id],
    enabled: isEdit,
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      const res = await tourTypeAdminApi1.getTourTypeById(id);
      return res.data;
    },
  });

  const [form, setForm] = useState<TourTypeSave>({
    nameType: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!detail) return;
    const t = detail as TourTypeDetailAdmin;
    setForm({
      nameType: t.nameType || "",
      description: t.description || "",
    });
    setErrors({});
  }, [detail]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  //  Validate tất cả trường bắt buộc
  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.nameType.trim()) e.nameType = "Không được để trống";
    if (!form.description?.trim()) e.description = "Không được để trống";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    try {
      if (isEdit && id) {
        await tourTypeAdminApi1.updateTourType(id, form);
      } else {
        await tourTypeAdminApi1.createTourType(form);
      }
      navigate("/admin/tour-types");
    } catch {
      setErrors((prev) => ({
        ...prev,
        form: "Lưu không thành công. Tên loại tour có thể đã tồn tại.",
      }));
    }
  };

  if (isEdit && isLoading) {
    return <div className="p-8 text-sm">Đang tải dữ liệu loại tour...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Chỉnh sửa loại tour" : "Thêm loại tour mới"}
          </h1>
          <p className="text-gray-500 mt-1">
            Quản lý loại tour dùng cho các tour trong hệ thống.
          </p>
        </div>
      </div>

      {errors.form && (
        <div className="mb-4 text-xs text-red-500">{errors.form}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800">
            Thông tin loại tour
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tên loại tour */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Tên loại tour
              </label>
              {errors.nameType && (
                <p className="text-[10px] text-red-500 mb-1">
                  {errors.nameType}
                </p>
              )}
              <input
                name="nameType"
                value={form.nameType}
                onChange={handleChange}
                className={
                  inputBase + (errors.nameType ? " border-red-500" : "")
                }
              />
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Mô tả
              </label>
              {errors.description && (
                <p className="text-[10px] text-red-500 mb-1">
                  {errors.description}
                </p>
              )}
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className={
                  inputBase +
                  "resize-none text-xs py-2 min-h-[20px]" +
                  (errors.description ? " border-red-500" : "")
                }
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/tour-types")}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-700"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-xs text-white font-semibold"
          >
            {isEdit ? "Lưu thay đổi" : "Tạo loại tour"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormTourTypeScreen;

