/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query"
import { reviewAdminApi } from "../../apis/reviewAdmin.api"
import type {
  ReviewAdmin,
  ReviewAdminListParams,
  ReviewStatus
} from "../../types/reviewAdmin.type"
import { MessageCircle, Star, Calendar, EyeOff, Eye } from "lucide-react"
import { toast } from "react-toastify"

const STATUS_LABELS: Record<ReviewStatus, string> = {
  PENDING: "Chờ xử lý",
  APPROVED: "Hiển thị",
  HIDDEN: "Đã ẩn"
}

const STATUS_COLORS: Record<ReviewStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  HIDDEN: "bg-red-100 text-red-700"
}

export default function ManageReviewScreen() {
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "ALL">("ALL")
  const [page, setPage] = useState(0)
  const size = 10

  const queryParams: ReviewAdminListParams = {
    page,
    size,
    status: statusFilter === "ALL" ? undefined : statusFilter
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-reviews", queryParams],
    queryFn: () => reviewAdminApi.getAll(queryParams).then((res) => res.data),
    placeholderData: keepPreviousData
  })

  const toggleStatusMutation = useMutation({
    mutationFn: (payload: { id: number; nextStatus: ReviewStatus }) =>
      reviewAdminApi.updateStatus(payload.id, payload.nextStatus),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái review thành công")
      refetch()
    },
    onError: () => {
      toast.error("Lỗi cập nhật trạng thái")
    }
  })

  const reviews: ReviewAdmin[] = data?.content || []
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number || 0

  const handleChangeStatus = (review: ReviewAdmin) => {
    // Logic: nếu đang APPROVED → HIDDEN, nếu HIDDEN → APPROVED, nếu PENDING → APPROVED
    const nextStatus: ReviewStatus =
      review.status === "APPROVED" ? "HIDDEN" : "APPROVED"

    toggleStatusMutation.mutate({ id: review.reviewID, nextStatus })
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Đánh giá</h1>
          <p className="text-gray-500 mt-1">
            Theo dõi và điều chỉnh việc hiển thị đánh giá của khách hàng
          </p>
        </div>
      </div>

      {/* Filter status */}
      <div className="bg-white shadow-md rounded-xl p-5 flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Trạng thái:</span>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={statusFilter}
            onChange={(e) => {
              const value = e.target.value as ReviewStatus | "ALL"
              setStatusFilter(value)
              setPage(0)
            }}
          >
            <option value="ALL">Tất cả</option>
            <option value="APPROVED">Hiển thị</option>
            <option value="HIDDEN">Đã ẩn</option>
            <option value="PENDING">Chờ xử lý</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-600 text-sm uppercase border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 font-bold text-black">Tour</th>
              <th className="px-5 py-3 font-bold text-black">Khách hàng</th>
              <th className="px-5 py-3 font-bold text-black text-center">Đánh giá</th>
              <th className="px-5 py-3 font-bold text-black">Nội dung</th>
              <th className="px-5 py-3 font-bold text-black text-center">Trạng thái</th>
              <th className="px-5 py-3 font-bold text-black text-center">Thời gian</th>
              <th className="px-5 py-3 font-bold text-black text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Đang tải dữ liệu đánh giá...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Không có đánh giá nào phù hợp.
                </td>
              </tr>
            ) : (
              reviews.map((r) => {
                const statusLabel = STATUS_LABELS[r.status]
                const statusColor = STATUS_COLORS[r.status]

                return (
                  <tr
                    key={r.reviewID}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                  >
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-start gap-2">
                        <MessageCircle className="w-4 h-4 text-blue-500 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {r.tourTitle || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {r.reviewID}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top text-sm">
                      <p className="font-medium text-gray-900">
                        {r.userName || "Khách"}
                      </p>
                      <p className="text-xs text-gray-500">{r.userEmail}</p>
                    </td>

                    <td className="px-5 py-4 align-top text-center">
                      <div className="inline-flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-sm">{r.rating}/5</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top text-sm max-w-xs">
                      <p className="line-clamp-3">{r.content}</p>
                    </td>

                    <td className="px-5 py-4 align-top text-center">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusColor}`}
                      >
                        {statusLabel}
                      </span>
                    </td>

                    <td className="px-5 py-4 align-top text-center text-sm">
                      <div className="inline-flex items-center gap-1 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleString("vi-VN")
                          : "N/A"}
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top text-center text-sm">
                      <button
                        onClick={() => handleChangeStatus(r)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium
                          ${r.status === "APPROVED"
                            ? "border-red-500 text-red-600 hover:bg-red-50"
                            : "border-green-500 text-green-600 hover:bg-green-50"
                          }`}
                        disabled={toggleStatusMutation.isPending}
                      >
                        {r.status === "APPROVED" ? (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Ẩn
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            Hiện
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 border rounded text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-40 transition"
          >
            ←
          </button>

          <span className="text-gray-700 font-medium">
            Trang {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
            className="px-4 py-2 border rounded text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-40 transition"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

