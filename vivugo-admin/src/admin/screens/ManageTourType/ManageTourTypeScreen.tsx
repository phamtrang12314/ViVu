import React, { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { omitBy, isUndefined } from "lodash";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { tourTypeAdminApi1 } from "../../apis/tourTypeAdmin.api";
import type {
  TourTypeAdmin,
  TourTypeAdminListParams,
  TourTypeSave,
} from "../../types/tourTypeAdmin";

// ================== Parse query ==================
type ParsedTourTypeParams = {
  page: number;
  size: number;
  search?: string;
};

const parseSearchParams = (
  searchParams: URLSearchParams
): ParsedTourTypeParams => {
  const params = {
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 0,
    size: searchParams.get("size") ? Number(searchParams.get("size")) : 10,
    search: searchParams.get("search") || undefined,
  };
  return omitBy(params, isUndefined) as ParsedTourTypeParams;
};

// ================== MAIN SCREEN ==================
const ManageTourTypeScreen: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParams = parseSearchParams(searchParams);

  // state cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState(queryParams.search || "");

  useEffect(() => {
    setSearchValue(queryParams.search || "");
  }, [queryParams.search]);

  const {
    data,
    isLoading,
    refetch, // dùng để reload list sau khi create/update
  } = useQuery({
    queryKey: ["admin-tour-types", queryParams],
    queryFn: () =>
      tourTypeAdminApi1
        .getAdminTourTypes(queryParams as TourTypeAdminListParams)
        .then((res) => res.data),
    placeholderData: keepPreviousData,
  });

  const tourTypes: TourTypeAdmin[] = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.number ?? 0;

  const handlePageChange = (page: number) => {
    const newParams = { ...queryParams, page };
    setSearchParams(newParams as any);
  };

  const updateParams = (patch: Partial<ParsedTourTypeParams>) => {
    const merged = omitBy(
      {
        ...queryParams,
        ...patch,
      },
      (v) => v === undefined || v === ""
    );
    setSearchParams(merged as any);
  };

  // MỞ MODAL – THÊM
  const handleCreate = () => {
    setModalMode("create");
    setEditingId(null);
    setIsModalOpen(true);
  };

  // MỞ MODAL – SỬA
  const handleEdit = (id: string) => {
    setModalMode("edit");
    setEditingId(id);
    setIsModalOpen(true);
  };

  // Xem chi tiết (vẫn chuyển trang như cũ)
  const handleDetail = (id: string) => {
    navigate(`/admin/tour-types/detail/${id}`);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Bạn chắc chắn muốn xóa loại tour này?");
    if (!confirmed) return;

    try {
      await tourTypeAdminApi1.deleteTourType(id);
      refetch();
    } catch {
      window.alert("Xóa loại tour thất bại. Loại tour có thể đang được tour sử dụng.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý loại tour
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Danh sách loại tour trong hệ thống
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all active:scale-95"
        >
          + Thêm loại tour
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white shadow-md rounded-xl p-5 flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên loại tour..."
          value={searchValue}
          onChange={(e) => {
            const value = e.target.value;
            setSearchValue(value);

            // cập nhật query param mỗi lần gõ
            updateParams({
              search: value || undefined, // rỗng thì bỏ param
              page: 0,
            });
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />

      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-base">
          <thead className="bg-gray-200 text-gray-600 uppercase border-b border-gray-200 text-sm">
            <tr>
              <th className="px-5 py-3 font-bold text-black">
                Tên loại tour
              </th>
              <th className="px-5 py-3 font-bold text-black">
                Mô tả ngắn
              </th>
              <th className="px-5 py-3 font-bold text-black text-center">
                Số tour dùng loại này
              </th>
              <th className="px-5 py-3 font-bold text-black text-center">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-gray-500 text-base"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : tourTypes.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-gray-500 text-base"
                >
                  Không có loại tour phù hợp.
                </td>
              </tr>
            ) : (
              tourTypes.map((t) => (
                <tr
                  key={t.tourTypeID}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {t.nameType}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700 line-clamp-2 mt-2">
                    {t.description || "-"}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {t.totalTours}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleDetail(t.tourTypeID)}
                        className="border border-gray-400 text-gray-600 rounded-lg p-2 hover:bg-gray-50"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(t.tourTypeID)}
                        className="border border-blue-500 text-blue-500 rounded-lg p-2 hover:bg-blue-50"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.tourTypeID)}
                        className="border border-red-500 text-red-500 rounded-lg p-2 hover:bg-red-50"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 text-sm">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            ←
          </button>
          <span className="text-gray-700 font-medium">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            →
          </button>
        </div>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <TourTypeFormModal
          mode={modalMode}
          tourTypeId={editingId}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            refetch(); // load lại list
          }}
        />
      )}
    </div>
  );
};

export default ManageTourTypeScreen;

// ================== MODAL COMPONENT ==================

type TourTypeFormModalProps = {
  mode: "create" | "edit";
  tourTypeId: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

const inputBase =
  "w-full border border-gray-300 rounded-xl px-3 py-3 text-base " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

type FormErrors = {
  [k: string]: string | undefined;
  form?: string;
};

const TourTypeFormModal: React.FC<TourTypeFormModalProps> = ({
  mode,
  tourTypeId,
  onClose,
  onSuccess,
}) => {
  const isEdit = mode === "edit";

  const [form, setForm] = useState<TourTypeSave>({
    nameType: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // load data khi edit
  useEffect(() => {
    if (!isEdit || !tourTypeId) return;

    const fetchDetail = async () => {
      try {
        setLoadingDetail(true);
        const res = await tourTypeAdminApi1.getTourTypeById(tourTypeId);
        const t = res.data as TourTypeAdmin;
        setForm({
          nameType: t.nameType || "",
          description: t.description || "",
        });
        setErrors({});
      } catch {
        setErrors((prev) => ({
          ...prev,
          form: "Không tải được dữ liệu loại tour.",
        }));
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchDetail();
  }, [isEdit, tourTypeId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

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
      setSubmitting(true);
      if (isEdit && tourTypeId) {
        await tourTypeAdminApi1.updateTourType(tourTypeId, form);
      } else {
        await tourTypeAdminApi1.createTourType(form);
      }
      onSuccess();
    } catch {
      setErrors((prev) => ({
        ...prev,
        form: "Lưu không thành công. Tên loại tour có thể đã tồn tại.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative">
        {/* nút X */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-base"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {isEdit ? "Chỉnh sửa loại tour" : "Thêm loại tour mới"}
        </h2>
        <p className="text-gray-500 text-base mb-4">
          {isEdit
            ? "Cập nhật thông tin loại tour."
            : "Nhập thông tin loại tour mới."}
        </p>

        {errors.form && (
          <div className="mb-3 text-sm text-red-500">{errors.form}</div>
        )}

        {loadingDetail && isEdit ? (
          <div className="py-6 text-base text-gray-500">
            Đang tải dữ liệu loại tour...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tên loại tour
              </label>
              {errors.nameType && (
                <p className="text-sm text-red-500 mb-1">
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

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Mô tả
              </label>
              {errors.description && (
                <p className="text-sm text-red-500 mb-1">
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
                  " resize-none min-h-[80px]" +
                  (errors.description ? " border-red-500" : "")
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-700"
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-sm text-white font-semibold disabled:opacity-60"
                disabled={submitting}
              >
                {submitting
                  ? "Đang lưu..."
                  : isEdit
                    ? "Lưu thay đổi"
                    : "Tạo loại tour"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

