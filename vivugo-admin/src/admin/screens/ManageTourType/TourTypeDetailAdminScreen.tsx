import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { tourTypeAdminApi1 } from '../../apis/tourTypeAdmin.api'
import type { TourTypeDetailAdmin } from '../../types/tourTypeAdmin'

const TourTypeDetailAdminScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-tour-type-detail', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error('missing id')
      const res = await tourTypeAdminApi1.getTourTypeById(id)
      return res.data as TourTypeDetailAdmin
    }
  })

  const handleBack = () => navigate('/admin/tour-types')

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-gray-500 text-sm">Đang tải thông tin loại tour...</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="p-8">
        <button
          onClick={handleBack}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </button>
        <p className="text-red-500 text-sm">Không tìm thấy loại tour.</p>
      </div>
    )
  }

  const tourType = data

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow hover:bg-gray-50 border border-gray-200"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{tourType.nameType}</h1>
            <p className="text-gray-500 text-xs">Trang quản trị chi tiết loại tour</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Thông tin loại tour */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-md p-6 flex flex-col gap-3">
          <h2 className="text-base font-semibold text-gray-800 mb-2">Thông tin loại tour</h2>

          <div className="text-xs text-gray-600">
            <span className="font-semibold">ID loại tour: </span>
            <span>{tourType.tourTypeID}</span>
          </div>

          <div className="text-xs text-gray-600">
            <span className="font-semibold">Ngày tạo: </span>
            <span>{new Date(tourType.createdAt).toLocaleString('vi-VN')}</span>
          </div>

          <div className="text-xs text-gray-600">
            <span className="font-semibold">Cập nhật gần nhất: </span>
            <span>{new Date(tourType.updateDate).toLocaleString('vi-VN')}</span>
          </div>

          {tourType.description && (
            <div className="mt-3">
              <div className="text-sm font-semibold text-gray-800 mb-1">Mô tả</div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {tourType.description}
              </p>
            </div>
          )}
        </div>

        {/* Thống kê tour dùng loại này */}
        <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-800">Thống kê tour theo loại</h2>

          <div className="bg-blue-50 rounded-2xl px-4 py-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-blue-500 font-semibold uppercase">
                Tổng số tour sử dụng loại này
              </div>
              <div className="text-2xl font-bold text-blue-700 mt-1">{tourType.totalTours}</div>
            </div>
          </div>

          <p className="text-[11px] text-gray-500">
            Mỗi tour trong hệ thống đều gắn với một loại tour. Chỉ số này giúp bạn biết loại tour
            này đang được sử dụng nhiều hay ít.
          </p>
        </div>
      </div>

      {/* Danh sách tour dùng loại tour này */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-3">
          Danh sách tour sử dụng loại tour này
        </h2>

        {tourType.totalTours === 0 ? (
          <div className="w-full py-8 text-center text-gray-400 text-sm bg-gray-50 rounded-2xl">
            Chưa có tour nào sử dụng loại tour này.
          </div>
        ) : (
          <ul className="list-decimal list-inside space-y-1 text-sm text-gray-800">
            {tourType.tourTitles.map((title, idx) => (
              <li key={idx}>{title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default TourTypeDetailAdminScreen

