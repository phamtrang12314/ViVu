// src/admin/screens/PromotionScreen/ManagePromotionScreen.tsx

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import {
  Edit2,
  PlusCircle,
  Tag,
  Calendar,
  Clock,
  Gift,
  CheckCircle,
  Ban,
  PauseCircle
} from 'lucide-react'
import { omitBy, isUndefined } from 'lodash'
import { promotionAdminApi } from '../../apis/promotionAdmin.api'
import type { PromotionAdmin, PromotionListAdminParams } from '../../types/promotionAdmin'
import { formatCurrency } from '../../../utils/utils'
import FormPromotionScreen from './FormPromotionScreen'

// ==== Component StatCard (Giữ nguyên) ====
type StatCardProps = {
  title: string
  value: number | string
  icon: React.ReactNode
  bgClass: string
  isLoading?: boolean
}

function StatCard({ title, value, icon, bgClass, isLoading }: StatCardProps) {
  return (
    <div className="bg-white shadow-md rounded-3xl p-6 flex items-center gap-5 border border-gray-200 hover:shadow-lg transition">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgClass}`}>
        {icon}
      </div>
      <div>
        {isLoading ? (
          <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mb-1"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
        <p className="text-gray-600">{title}</p>
      </div>
    </div>
  )
}

// ==== Constants & Helpers (Giữ nguyên) ====
const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Không hoạt động',
  EXPIRED: 'Đã hết hạn'
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-gray-100 text-gray-700',
  EXPIRED: 'bg-red-100 text-red-700'
}

const DISCOUNT_TYPE_LABELS_MAP: Record<string, string> = {
  PERCENTAGE: 'Phần trăm',
  FIXED_AMOUNT: 'Cố định'
}

type ParsedPromotionParams = {
  page: number
  size: number
  search?: string
  status?: string
  discountType?: string
}

const parseSearchParams = (searchParams: URLSearchParams): ParsedPromotionParams => {
  const params = {
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    size: searchParams.get('size') ? Number(searchParams.get('size')) : 10,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    discountType: searchParams.get('discountType') || undefined
  }
  return omitBy(params, isUndefined) as ParsedPromotionParams
}

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('vi-VN')
  } catch (error) {
    return dateString
  }
}

// Helper Modal (Giữ nguyên)
const SimpleModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}> = ({ isOpen, children }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

// === START LOGIC MỚI ===

// Hàm tính toán trạng thái hiển thị (Client-side)
const calculateDisplayStatus = (promotion: PromotionAdmin): string => {
  const now = new Date()
  const endDate = new Date(promotion.endDate)

  // Logic ưu tiên:
  // 1. Nếu status DB là "INACTIVE" -> Inactive
  if (promotion.status === 'INACTIVE') {
    return 'INACTIVE'
  }
  // 2. Nếu date > endDate HOẶC status DB là "EXPIRED" -> Expired
  if (now > endDate || promotion.status === 'EXPIRED') {
    return 'EXPIRED'
  }
  // 3. Còn lại -> Active
  return 'ACTIVE'
}

export default function ManagePromotionScreen() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParams = parseSearchParams(searchParams)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPromotionId, setEditingPromotionId] = useState<string | undefined>(undefined)

  // 1. TẠO QUERY PARAMS CHO API: Bỏ status=ACTIVE/EXPIRED để API trả về hết
  const apiQueryParams = useMemo(() => {
    const params = {
      page: queryParams.page,
      size: queryParams.size,
      search: queryParams.search,
      discountType: queryParams.discountType
    }

    // Nếu filter là INACTIVE, gửi thẳng xuống API để API lọc
    if (queryParams.status === 'INACTIVE') {
      return { ...params, status: 'INACTIVE' }
    }

    // Nếu filter là ACTIVE, EXPIRED, hoặc ALL, KHÔNG gửi status.
    // Chúng ta sẽ lọc trên Client sau khi có dữ liệu thô.
    return params
  }, [queryParams])

  // 2. Query lấy dữ liệu cho Bảng (Sử dụng apiQueryParams mới)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-promotions', apiQueryParams],
    queryFn: () =>
      promotionAdminApi
        .getAllPromotions(apiQueryParams as PromotionListAdminParams)
        .then((res) => res.data),
    placeholderData: keepPreviousData
  })

  // 3. Query lấy TẤT CẢ dữ liệu để tính toán thống kê chính xác
  const {
    data: allPromotionsData,
    isLoading: isLoadingStats,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['admin-all-promotions-stats'],
    queryFn: () => promotionAdminApi.getAllPromotions({ size: 1000 }).then((res) => res.data),
    staleTime: 1000 * 60 * 5
  })

  // 4. Logic tính toán Stats tại Client (Giữ nguyên)
  const stats = useMemo(() => {
    const list = allPromotionsData?.content || []
    const total = allPromotionsData?.totalElements || 0

    let active = 0
    let inactive = 0
    let expired = 0

    list.forEach((p) => {
      const displayStatus = calculateDisplayStatus(p)
      if (displayStatus === 'INACTIVE') {
        inactive++
      } else if (displayStatus === 'EXPIRED') {
        expired++
      } else if (displayStatus === 'ACTIVE') {
        active++
      }
    })

    return { total, active, inactive, expired }
  }, [allPromotionsData])

  const rawPromotions: PromotionAdmin[] = useMemo(() => data?.content || [], [data])
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number || 0

  // 5. LỌC THÊM TRÊN CLIENT DỰA TRÊN TRẠNG THÁI HIỂN THỊ
  const promotions = useMemo(() => {
    // Nếu filter là INACTIVE, API đã lọc, chỉ cần trả về kết quả
    if (queryParams.status === 'INACTIVE') return rawPromotions

    // Nếu không có filter status, hoặc filter là ALL, giữ nguyên danh sách
    if (!queryParams.status || queryParams.status === '') return rawPromotions

    // Lọc lại dựa trên trạng thái hiển thị được tính toán trên Client
    return rawPromotions.filter((p) => calculateDisplayStatus(p) === queryParams.status)
  }, [rawPromotions, queryParams.status])

  const handlePageChange = (page: number) => {
    const newParams = { ...queryParams, page }
    setSearchParams(newParams as any)
  }

  const handleFilterChange = (key: keyof ParsedPromotionParams, value: string | undefined) => {
    const newParams = { ...queryParams, [key]: value, page: 0 }
    setSearchParams(omitBy(newParams, isUndefined) as any)
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFilterChange('search', e.currentTarget.value || undefined)
    }
  }

  const handleCreate = () => {
    setEditingPromotionId(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (id: string) => {
    setEditingPromotionId(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = (shouldRefetch: boolean = false) => {
    setIsModalOpen(false)
    setEditingPromotionId(undefined)
    if (shouldRefetch) {
      refetch()
      refetchStats() // Cập nhật lại thống kê khi có thay đổi
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Khuyến mãi</h1>
          <p className="text-gray-500 mt-1">Danh sách mã khuyến mãi đang hoạt động</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700 text-white text-base font-semibold px-6 py-3 rounded-lg shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          <PlusCircle size={20} /> Tạo mã mới
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white shadow-md rounded-xl p-5 flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã, mô tả..."
          defaultValue={queryParams.search || ''}
          onKeyDown={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          className="border border-gray-300 rounded-lg p-2 min-w-[150px]"
          value={queryParams.discountType || ''}
          onChange={(e) => handleFilterChange('discountType', e.target.value || undefined)}
        >
          <option value="">Loại khuyến mãi</option>
          <option value="PERCENTAGE">Phần trăm (%)</option>
          <option value="FIXED_AMOUNT">Số tiền cố định</option>
        </select>

        {/* --- Bộ lọc Trạng thái --- */}
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 min-w-[150px]"
          value={queryParams.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hoạt động</option>
          <option value="INACTIVE">Không hoạt động</option>
          <option value="EXPIRED">Đã hết hạn</option>
        </select>
        {/* --- Hết Bộ lọc Trạng thái --- */}
      </div>

      {/* Stat Cards Section (Sử dụng stats đã tính toán lại) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng số mã"
          value={stats.total}
          icon={<Gift className="w-6 h-6 text-blue-600" />}
          bgClass="bg-blue-100"
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Đang hoạt động"
          value={stats.active}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          bgClass="bg-green-100"
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Không hoạt động"
          value={stats.inactive}
          icon={<PauseCircle className="w-6 h-6 text-gray-600" />}
          bgClass="bg-gray-200"
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Đã hết hạn"
          value={stats.expired}
          icon={<Ban className="w-6 h-6 text-red-600" />}
          bgClass="bg-red-100"
          isLoading={isLoadingStats}
        />
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-600 text-sm uppercase border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 font-bold text-black">Mã KM</th>
              <th className="px-5 py-3 font-bold text-black">Loại/Giá trị</th>
              <th className="px-5 py-3 font-bold text-black">Thời gian</th>
              <th className="px-5 py-3 text-center font-bold text-black">SL Giới hạn</th>
              <th className="px-5 py-3 text-center font-bold text-black">SL Đã dùng</th>
              <th className="px-5 py-3 text-center font-bold text-black">Trạng thái</th>
              <th className="px-5 py-3 text-center font-bold text-black">Thao tác</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Đang tải dữ liệu khuyến mãi...
                </td>
              </tr>
            ) : promotions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Không tìm thấy mã khuyến mãi nào.
                </td>
              </tr>
            ) : (
              promotions.map((promotion: PromotionAdmin) => {
                // SỬ DỤNG HÀM MỚI ĐỂ ĐỒNG BỘ TRẠNG THÁI HIỂN THỊ
                const displayStatus = calculateDisplayStatus(promotion)

                const label = STATUS_LABELS[displayStatus] || displayStatus
                const color = STATUS_COLORS[displayStatus] || 'bg-gray-100 text-gray-700'

                const isPercentage =
                  promotion.discountType === 'PERCENTAGE' || promotion.discountPercentage > 0

                const discountValue = isPercentage
                  ? `${promotion.discountPercentage}%`
                  : promotion.discountAmount
                    ? formatCurrency(promotion.discountAmount)
                    : 'N/A'

                const discountTypeLabel = isPercentage
                  ? 'Phần trăm'
                  : promotion.discountType === 'FIXED_AMOUNT' ||
                      (promotion.discountAmount && promotion.discountAmount > 0)
                    ? 'Cố định'
                    : DISCOUNT_TYPE_LABELS_MAP[promotion.discountType] || 'N/A'
                return (
                  <tr
                    key={promotion.promotionID}
                    className={`border-b border-gray-100 transition-all ${
                      displayStatus === 'EXPIRED'
                        ? 'bg-gray-50 opacity-60 grayscale-[0.5]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900 text-sm">{promotion.title}</p>
                      <p className="text-gray-500 text-sm line-clamp-1 max-w-xs">
                        {promotion.description}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-gray-700">
                          <Tag size={16} className="text-blue-500" />
                          {discountTypeLabel}
                        </div>
                        <span className="font-bold text-base ">{discountValue}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-700">
                        <Calendar size={14} className="text-gray-500" />
                        {formatDate(promotion.startDate)}
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          displayStatus === 'EXPIRED' ? 'text-red-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <Clock
                          size={14}
                          className={displayStatus === 'EXPIRED' ? 'text-red-500' : 'text-gray-500'}
                        />
                        {formatDate(promotion.endDate)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center text-sm font-semibold">
                      {promotion.limitUsage === 0
                        ? 'Vô hạn'
                        : promotion.limitUsage.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-center text-sm font-semibold">
                      {promotion.currentUsage.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-center text-sm">
                      <span className={`px-3 py-1.5 rounded-full font-medium ${color}`}>
                        {label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center text-sm">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleEdit(promotion.promotionID)}
                          className="border border-blue-500 text-blue-500 rounded-lg p-2 hover:bg-blue-50"
                          aria-label="Chỉnh sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
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

      {/* Modal Form */}
      <SimpleModal isOpen={isModalOpen} onClose={() => handleCloseModal()}>
        <FormPromotionScreen
          promotionId={editingPromotionId}
          onClose={() => handleCloseModal(true)}
        />
      </SimpleModal>
    </div>
  )
}

