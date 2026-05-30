import { useEffect, useState } from 'react'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { isUndefined, omitBy } from 'lodash'
import { Edit2, Eye, Trash2 } from 'lucide-react'
import { tourAdminApi } from '../../apis/tourAdmin.api'
import { tourTypeApi } from '../../../apis/tourType.api'
import type { TourType } from '@/types/tourType.type'
import type { TourListAdminParams } from '../../../types/tour'
import { resolveAssetUrl } from '../../../utils/utils'

type ParsedTourParams = {
  page: number
  size: number
  search?: string
  tour_type_id?: string
  status?: string
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Đang hoạt động',
  PAUSE: 'Tạm dừng',
  SOLD_OUT: 'Hết chỗ',
  COMPLETED: 'Hoàn thành',
  CANCELED: 'Đã xóa'
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSE: 'bg-yellow-100 text-yellow-700',
  SOLD_OUT: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-slate-100 text-slate-700',
  CANCELED: 'bg-rose-100 text-rose-700'
}

const parseSearchParams = (searchParams: URLSearchParams): ParsedTourParams => {
  const params = {
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    size: searchParams.get('size') ? Number(searchParams.get('size')) : 10,
    search: searchParams.get('search') || undefined,
    tour_type_id: searchParams.get('tour_type_id') || undefined,
    status: searchParams.get('status') || undefined
  }
  return omitBy(params, isUndefined) as ParsedTourParams
}

export default function ManageTourScreen() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParams = parseSearchParams(searchParams)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchValue, setSearchValue] = useState(queryParams.search || '')

  useEffect(() => {
    setSearchValue(queryParams.search || '')
  }, [queryParams.search])

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tours', queryParams],
    queryFn: () => tourAdminApi.getAllTours(queryParams as TourListAdminParams).then((res) => res.data),
    placeholderData: keepPreviousData
  })

  const { data: tourTypes, isLoading: isLoadingTypes } = useQuery<TourType[]>({
    queryKey: ['tourTypes'],
    queryFn: () => tourTypeApi.getTourTypes().then((res) => res.data)
  })

  const tours = data?.content || []
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number || 0

  const handlePageChange = (page: number) => {
    const newParams = { ...queryParams, page }
    setSearchParams(omitBy(newParams, isUndefined) as any)
  }

  const updateParams = (newParams: Partial<ParsedTourParams>) => {
    const merged = { ...queryParams, ...newParams }
    setSearchParams(omitBy(merged, isUndefined) as any)
  }

  const handleDeleteTour = async (tourId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa tour này?')) return
    await tourAdminApi.deleteTour(tourId)
    await queryClient.invalidateQueries({ queryKey: ['admin-tours'] })
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Quản lý tour</h1>
          <p className='mt-1 text-gray-500'>Danh sách tour hiện có trong hệ thống</p>
        </div>
        <button
          onClick={() => navigate('/admin/tours/new')}
          className='rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all active:scale-95 hover:bg-blue-700'
        >
          + Tạo tour mới
        </button>
      </div>

      <div className='mb-6 flex flex-wrap items-center gap-4 rounded-xl bg-white p-5 shadow-md'>
        <input
          type='text'
          placeholder='Tìm kiếm tour...'
          value={searchValue}
          onChange={(event) => {
            const value = event.target.value
            setSearchValue(value)
            updateParams({ search: value || undefined, page: 0 })
          }}
          className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 sm:w-1/3'
        />

        <select
          className='min-w-[180px] rounded-lg border border-gray-300 p-2'
          value={queryParams.tour_type_id || ''}
          onChange={(event) => updateParams({ tour_type_id: event.target.value || undefined, page: 0 })}
        >
          <option value=''>Tất cả loại tour</option>
          {isLoadingTypes && <option disabled>Đang tải loại tour...</option>}
          {!isLoadingTypes &&
            tourTypes?.map((type) => (
              <option key={type.tourTypeID} value={type.tourTypeID}>
                {type.nameType}
              </option>
            ))}
        </select>

        <select
          className='min-w-[180px] rounded-lg border border-gray-300 px-4 py-2'
          value={queryParams.status || ''}
          onChange={(event) => updateParams({ status: event.target.value || undefined, page: 0 })}
        >
          <option value=''>Tất cả trạng thái</option>
          <option value='ACTIVE'>Đang hoạt động</option>
          <option value='PAUSE'>Tạm dừng</option>
          <option value='SOLD_OUT'>Hết chỗ</option>
          <option value='COMPLETED'>Hoàn thành</option>
          <option value='CANCELED'>Đã xóa</option>
        </select>
      </div>

      <div className='overflow-hidden rounded-2xl bg-white shadow-xl'>
        <table className='w-full border-collapse text-left'>
          <thead className='border-b border-gray-200 bg-gray-200 text-sm uppercase text-gray-600'>
            <tr>
              <th className='px-5 py-3 text-center font-bold text-black'>Tour</th>
              <th className='px-5 py-3 font-bold text-black'>Địa điểm du lịch</th>
              <th className='px-5 py-3 text-center font-bold text-black'>Giá</th>
              <th className='px-5 py-3 text-center font-bold text-black'>Ngày kết thúc</th>
              <th className='px-5 py-3 text-center font-bold text-black'>Trạng thái</th>
              <th className='px-5 py-3 text-center font-bold text-black'>Thao tác</th>
            </tr>
          </thead>
          <tbody className='text-gray-800'>
            {isLoading ? (
              <tr>
                <td colSpan={7} className='py-8 text-center text-gray-500'>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : (
              tours.map((tour: any) => {
                const label = STATUS_LABELS[tour.status] || tour.status
                const color = STATUS_COLORS[tour.status] || 'bg-gray-100 text-gray-700'
                const disabledEdit = tour.status === 'CANCELED'

                return (
                  <tr key={tour.tourID} className='border-b border-gray-100 transition-all hover:bg-gray-50'>
                    <td className='px-5 py-4'>
                      <div className='flex items-center gap-4'>
                        <img
                          src={resolveAssetUrl(tour.imageURL, 'https://placehold.co/400x300?text=Tour')}
                          alt={tour.title}
                          className='h-20 w-20 rounded-xl object-cover'
                        />
                        <div>
                          <p className='text-sm font-semibold text-gray-900'>{tour.title}</p>
                          <p className='text-sm text-gray-500'>{tour.tourTypeName}</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-5 py-4 text-sm'>{tour.destinationName}</td>
                    <td className='px-5 py-4 text-center text-sm'>
                      <div className='text-sm font-semibold text-gray-900'>{tour.priceAdult?.toLocaleString()}đ</div>
                    </td>
                    <td className='px-5 py-4 text-center text-sm'>
                      {tour.endDate ? new Date(tour.endDate).toLocaleDateString('vi-VN') : '/'}
                    </td>
                    <td className='px-5 py-4 text-center text-sm'>
                      <span className={`rounded-full px-3 py-1.5 font-medium ${color}`}>{label}</span>
                    </td>
                    <td className='px-5 py-4 text-center text-sm'>
                      <div className='inline-flex gap-2'>
                        <button
                          onClick={() => navigate(`/admin/tours/details/${tour.tourID}`)}
                          className='rounded-lg border border-gray-400 p-2 text-gray-600 hover:bg-gray-50'
                          title='Xem'
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/tours/${tour.tourID}/edit`)}
                          disabled={disabledEdit}
                          className='rounded-lg border border-blue-500 p-2 text-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40'
                          title='Sửa'
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTour(tour.tourID)}
                          disabled={tour.status === 'CANCELED'}
                          className='rounded-lg border border-red-500 p-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40'
                          title='Xóa'
                        >
                          <Trash2 size={16} />
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

      {totalPages > 1 && (
        <div className='mt-8 flex items-center justify-center gap-4'>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className='rounded border px-4 py-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40'
          >
            ←
          </button>
          <span className='font-medium text-gray-700'>
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
            className='rounded border px-4 py-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40'
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
