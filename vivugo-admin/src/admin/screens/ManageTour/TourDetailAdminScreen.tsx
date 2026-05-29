import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { tourAdminApi } from '../../apis/tourAdmin.api'
import type { TourDetailAdmin } from '../../types/tourAdmin'
import { ArrowLeft, Calendar, Users, DollarSign, MapPin } from 'lucide-react'
import { resolveAssetUrl } from '../../../utils/utils'

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Đang hoạt động',
  PAUSE: 'Tạm dừng',
  SOLD_OUT: 'Hết chỗ',
  COMPLETED: 'Hoàn thành'
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSE: 'bg-yellow-100 text-yellow-700',
  SOLD_OUT: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-gray-200 text-gray-700'
}

type ExtendedTourDetail = TourDetailAdmin

export default function TourDetailAdminScreen() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery<ExtendedTourDetail>({
    queryKey: ['tour-detail', id],
    queryFn: () => tourAdminApi.getTourById(id as string).then((res) => res.data),
    enabled: !!id
  })

  const tour = data

  if (isLoading) return <div className="p-8 text-base">Đang tải chi tiết tour</div>

  if (isError || !tour) {
    return (
      <div className="p-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-4 text-sm text-gray-600"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>
        <div className="text-red-500 text-sm">Không tải được chi tiết tour</div>
      </div>
    )
  }

  const statusLabel = STATUS_LABELS[tour.status] || tour.status
  const statusColor = STATUS_COLORS[tour.status] || 'bg-gray-100 text-gray-700'

  const routeNames =
    tour.tourDestinations
      ?.map((td) => td.destination?.nameDes)
      .filter(Boolean)
      .join(' • ') || 'Chưa cấu hình'

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/manage-tour')}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow hover:bg-gray-50 border border-gray-200"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chi tiết tour</h1>
          <p className="text-sm text-gray-500 mt-1">Thông tin chi tiết tour ID: {tour.tourID}</p>
        </div>
      </div>

      {/* Hàng trên: Thông tin tour + Thời gian */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Thông tin tour */}
        <div className="bg-white rounded-2xl shadow-sm p-6 lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-base font-semibold text-gray-800">Thông tin tour</h2>
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusColor}`}>
              {statusLabel}
            </span>
          </div>

          <div className="flex gap-4">
            {tour.imageURL && (
              <img
                src={resolveAssetUrl(tour.imageURL, 'https://placehold.co/900x540?text=Tour')}
                alt={tour.title}
                className="w-32 h-32 rounded-xl object-cover flex-shrink-0"
              />
            )}
            <div className="space-y-2 flex-1">
              <p className="text-lg font-semibold text-gray-900">{tour.title}</p>

              <p className="text-sm text-gray-700">
                Loại tour: <span className="font-medium">{tour.tourType?.name || 'Không có'}</span>
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Users size={16} />
                <span>
                  Số khách:{' '}
                  <span className="font-medium">
                    {tour.minParticipants} - {tour.maxParticipants}
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-gray-800">
                  <DollarSign size={16} />
                  <span>Giá người lớn: {tour.priceAdult?.toLocaleString('vi-VN') || 0} đ</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-800">
                  <DollarSign size={16} />
                  <span>Giá trẻ em: {tour.priceChild?.toLocaleString('vi-VN') || 0} đ</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                <MapPin size={16} />
                <span className="line-clamp-2">
                  Lộ trình: <span className="font-medium">{routeNames}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Thời gian */}
        <div className="bg-white rounded-2xl shadow-sm p-6 lg:col-span-1">
          <h2 className="text-base font-semibold text-gray-800 mb-2">Thời gian</h2>

          <div className="mb-2 text-sm text-gray-800">
            Thời lượng:{' '}
            <span className="font-semibold">
              {tour.durationDays} ngày {tour.durationNights} đêm
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
            <Calendar size={16} />
            <span>
              Khởi hành: <span className="font-medium">{tour.startDate}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
            <Calendar size={16} />
            <span>
              Kết thúc: <span className="font-medium">{tour.endDate}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mô tả */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Mô tả tour</h3>
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {tour.description || 'Chưa có mô tả'}
        </p>
      </section>

      {/* Lộ trình điểm đến */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Lộ trình điểm đến</h3>
        {tour.tourDestinations && tour.tourDestinations.length > 0 ? (
          <div className="space-y-3 text-sm">
            {tour.tourDestinations.map((td, index) => (
              <div key={td.tourDestinationID} className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-semibold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{td.destination?.nameDes}</p>
                  <p className="text-xs text-gray-500">{td.destination?.region}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Chưa cấu hình điểm đến</p>
        )}
      </section>

      {/* Lịch trình chi tiết */}
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Lịch trình chi tiết</h3>
        {tour.itineraries && tour.itineraries.length > 0 ? (
          <div className="space-y-4 text-sm">
            {tour.itineraries.map((it) => (
              <div key={it.itineraryID || it.dayNumber} className="flex gap-3">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-semibold mt-2">
                  {it.dayNumber}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {it.title || `Ngày ${it.dayNumber}`}
                  </p>
                  <p className="mt-1 text-gray-700 whitespace-pre-line">
                    {it.description || 'Chưa có mô tả chi tiết'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Chưa cấu hình lịch trình chi tiết.</p>
        )}
      </section>
    </div>
  )
}

