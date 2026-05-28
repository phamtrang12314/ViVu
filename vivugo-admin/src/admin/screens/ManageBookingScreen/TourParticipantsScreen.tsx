import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, FileDown, ArrowLeft } from 'lucide-react'
import Select from 'react-select'

import { tourAdminApi } from '../../apis/tourAdmin.api'
import { bookingAdminApi } from '../../apis/bookingAdmin.api'

import type { BookingStatus } from '@/types/booking.type'
import type { SimpleTour2, TourParticipants } from '@/admin/types/tourAdmin'

const statusLabelMap: Record<BookingStatus, string> = {
  PROCESSING: 'Đang xử lý',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELED: 'Đã hủy',
  CANCELLATION_REQUESTED: 'Chờ duyệt hủy'
}

const genderLabelMap: Record<string, string> = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác'
}

const participantTypeLabelMap: Record<string, string> = {
  ADULT: 'Người lớn',
  CHILD: 'Trẻ em'
}

const tourStatusLabelMap: Record<string, string> = {
  ACTIVE: 'Đang mở',
  PAUSE: 'Tạm dừng',
  SOLD_OUT: 'Hết chỗ',
  COMPLETED: 'Hoàn thành',
  CANCELED: 'Đã hủy'
}

const formatDateTime = (value: string) => new Date(value).toLocaleString('vi-VN')

const formatDate = (value?: string | null) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('vi-VN')
}

const TourParticipantsScreen: React.FC = () => {
  const navigate = useNavigate()

  const [selectedTitle, setSelectedTitle] = useState<string>('')
  const [selectedTourId, setSelectedTourId] = useState<string>('')

  // 1. Lấy toàn bộ tour (không bị hủy) để chọn (tìm trong combobox)
  const {
    data: toursRes,
    isLoading: loadingTours,
    refetch: refetchTours
  } = useQuery({
    queryKey: ['admin-participant-tours'],
    queryFn: async () => {
      // backend filter status != CANCELED
      const res = await tourAdminApi.searchToursForParticipants(undefined)
      return res.data as SimpleTour2[]
    }
  })

  const tours: SimpleTour2[] = useMemo(() => toursRes || [], [toursRes])

  // Group theo title
  const groupedTours = useMemo(() => {
    const map = new Map<string, SimpleTour2[]>()
    tours.forEach((t) => {
      const list = map.get(t.title) ?? []
      list.push(t)
      map.set(t.title, list)
    })

    return Array.from(map.entries()).map(([title, items]) => ({
      title,
      tours: items
    }))
  }, [tours])

  // Options cho react-select (chỉ hiển thị tên tour)
  const titleOptions = useMemo(
    () =>
      groupedTours.map((g) => ({
        value: g.title,
        label: g.title
      })),
    [groupedTours]
  )

  // Group đang được chọn (theo title)
  const selectedGroup = useMemo(
    () => groupedTours.find((g) => g.title === selectedTitle) ?? null,
    [groupedTours, selectedTitle]
  )

  // 2. Lấy danh sách participant theo tourId đã chọn
  const {
    data: tourParticipants,
    isLoading: loadingParticipants,
    refetch: refetchParticipants
  } = useQuery({
    queryKey: ['admin-tour-participants', selectedTourId],
    enabled: !!selectedTourId,
    queryFn: async () => {
      const res = await bookingAdminApi.getParticipantsByTour(selectedTourId)
      return res.data as TourParticipants
    }
  })

  const handleRefresh = () => {
    refetchTours()
    if (selectedTourId) {
      refetchParticipants()
    }
  }

  const handleExport = async () => {
    if (!selectedTourId) {
      alert('Vui lòng chọn tour trước khi xuất file.')
      return
    }

    try {
      const res = await bookingAdminApi.exportParticipantsByTour(selectedTourId)

      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      const fileName =
        'danh-sach-khach-' +
        (tourParticipants?.tourName?.replace(/[/\\:*?"<>|]/g, '_') || 'tour') +
        '.pdf'

      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Xuất file PDF thất bại.')
    }
  }

  const handleSelectTitle = (opt: { value: string; label: string } | null) => {
    const value = opt?.value ?? ''
    setSelectedTitle(value)
    setSelectedTourId('')

    if (!value) return
    const group = groupedTours.find((g) => g.title === value)
    if (!group) return

    // Nếu chỉ có 1 tour mang tên đó → auto chọn luôn tourId
    if (group.tours.length === 1) {
      setSelectedTourId(group.tours[0].tourId)
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/manage-booking')}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow hover:bg-gray-50 border border-gray-200"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Xem khách theo tour</h1>
            <p className="text-sm text-gray-500">
              Chọn tên tour trong combobox. Nếu tên tour trùng cho nhiều chuyến khác nhau, hệ thống
              sẽ yêu cầu chọn chính xác bằng radio.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-500 text-blue-600 text-sm font-medium bg-white hover:bg-blue-50 transition"
          >
            <FileDown size={16} />
            Xuất file
          </button>

          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition"
          >
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Combobox chọn tên tour (react-select, searchable) */}
      <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Chọn tour</label>

        <Select
          isClearable
          isSearchable
          options={titleOptions}
          placeholder={loadingTours ? 'Đang tải danh sách tour...' : '— Chọn tour —'}
          value={titleOptions.find((opt) => opt.value === selectedTitle) || null}
          onChange={handleSelectTitle}
          classNamePrefix="react-select"
          className="min-w-[260px] text-sm"
        />

        {/* Nếu có ≥ 2 tour cùng tên → chọn bằng radio */}
        {selectedGroup && selectedGroup.tours.length > 1 && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Hãy chọn đúng tour:</p>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {selectedGroup.tours.map((t) => (
                <label
                  key={t.tourId}
                  className="flex items-start gap-3 px-3 py-2 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="selectedTour"
                    className="mt-1"
                    checked={selectedTourId === t.tourId}
                    onChange={() => setSelectedTourId(t.tourId)}
                  />
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{t.title}</span>
                      {t.code && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          Mã tour: {t.code}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 flex flex-wrap gap-3">
                      <span>Khởi hành: {formatDate(t.startDate)}</span>
                      <span>Kết thúc: {formatDate(t.endDate)}</span>
                      <span>
                        Trạng thái: <b>{tourStatusLabelMap[t.status] || t.status}</b>
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bảng danh sách participant */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {loadingParticipants && selectedTourId ? (
          <div className="p-6 text-center text-gray-500 text-sm">Đang tải danh sách khách...</div>
        ) : !selectedTourId ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            Vui lòng chọn tour để xem danh sách
          </div>
        ) : tourParticipants && tourParticipants.participants.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            Chưa có khách nào tham gia tour này.
          </div>
        ) : tourParticipants ? (
          <>
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-sm text-gray-600">
                Tour:{' '}
                <span className="font-semibold text-gray-900">
                  {tourParticipants.tourName || '—'}
                </span>{' '}
                · {tourParticipants.participants.length} khách tham gia
              </p>
            </div>

            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-5 py-3">Khách tham gia</th>
                  <th className="px-5 py-3">Liên hệ</th>
                  <th className="px-5 py-3">Giấy tờ</th>
                  <th className="px-5 py-3">Giới tính</th>
                  <th className="px-5 py-3">Loại khách</th>
                  <th className="px-5 py-3">Booking</th>
                  <th className="px-5 py-3">Ngày đặt</th>
                  <th className="px-5 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {tourParticipants.participants.map((p) => (
                  <tr key={p.participantId} className="border-b border-gray-100">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-gray-900">{p.fullName}</div>
                    </td>
                    <td className="px-5 py-3 text-sm">{p.phone || '-'}</td>
                    <td className="px-5 py-3 text-sm">{p.identification || '-'}</td>
                    <td className="px-5 py-3 text-sm">
                      {p.gender ? genderLabelMap[p.gender] || p.gender : '-'}
                    </td>
                    <td className="px-5 py-3 text-sm">
                      {p.participantType
                        ? participantTypeLabelMap[p.participantType] || p.participantType
                        : '-'}
                    </td>
                    <td className="px-5 py-3 text-sm">{p.bookingId}</td>
                    <td className="px-5 py-3 text-sm">{formatDateTime(p.bookingDate)}</td>
                    <td className="px-5 py-3 text-sm">{statusLabelMap[p.bookingStatus]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="p-6 text-center text-gray-500 text-sm">Không tải được dữ liệu.</div>
        )}
      </div>
    </div>
  )
}

export default TourParticipantsScreen

