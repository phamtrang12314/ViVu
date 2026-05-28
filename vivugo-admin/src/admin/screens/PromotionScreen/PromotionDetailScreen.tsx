import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'

import { promotionAdminApi } from '../../apis/promotionAdmin.api'
import { formatCurrency } from '../../../utils/utils'

const statusLabels: Record<string, string> = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Không hoạt động',
  EXPIRED: 'Đã hết hạn'
}

const statusClasses: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  INACTIVE: 'bg-gray-50 text-gray-700 border-gray-200',
  EXPIRED: 'bg-red-50 text-red-700 border-red-200'
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('vi-VN')
}

export default function PromotionDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: promotion, isLoading } = useQuery({
    queryKey: ['admin-promotion-detail', id],
    enabled: Boolean(id),
    queryFn: () => promotionAdminApi.getPromotionById(id as string).then((res) => res.data)
  })

  const discountText = useMemo(() => {
    if (!promotion) return '-'
    if (promotion.discountPercentage > 0) return `${promotion.discountPercentage}%`
    if (promotion.discountAmount && promotion.discountAmount > 0) return formatCurrency(promotion.discountAmount)
    return 'Không có'
  }, [promotion])

  if (isLoading) {
    return <div className="p-8 text-gray-500">Đang tải chi tiết khuyến mãi...</div>
  }

  if (!promotion) {
    return <div className="p-8 text-gray-500">Không tìm thấy khuyến mãi.</div>
  }

  const statusClass = statusClasses[promotion.status] || statusClasses.INACTIVE

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/admin/promotions')}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết khuyến mãi</h1>
          <p className="text-sm text-gray-500">Mã {promotion.promotionID}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{promotion.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{promotion.description || '-'}</p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusClass}`}>
              {statusLabels[promotion.status] || promotion.status}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
                <Tag size={16} />
                Giá trị giảm
              </div>
              <p className="text-2xl font-bold text-blue-600">{discountText}</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
                <Calendar size={16} />
                Thời gian áp dụng
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Lượt sử dụng</h2>
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Đã dùng</dt>
              <dd className="font-bold text-gray-900">{promotion.currentUsage.toLocaleString('vi-VN')}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Giới hạn</dt>
              <dd className="font-bold text-gray-900">
                {promotion.limitUsage === 0 ? 'Vô hạn' : promotion.limitUsage.toLocaleString('vi-VN')}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  )
}
