import React, { useEffect, useMemo, useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { omitBy, isUndefined } from 'lodash'
import { Eye, Edit2 } from 'lucide-react'
import { destinationAdminApi } from '../../apis/destinationAdmin.api'
import type { DestinationAdmin, DestinationAdminListParams } from '../../types/destinationAdmin'

// Kiểu query param
type ParsedDestinationParams = {
  page: number
  size: number
  search?: string // tìm theo tên điểm đến
  region?: string // lọc theo khu vực
  location?: string // lọc theo địa điểm
}

// Parse URL -> object
const parseSearchParams = (searchParams: URLSearchParams): ParsedDestinationParams => {
  const params = {
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    size: searchParams.get('size') ? Number(searchParams.get('size')) : 10,
    search: searchParams.get('search') || undefined,
    region: searchParams.get('region') || undefined,
    location: searchParams.get('location') || undefined
  }
  return omitBy(params, isUndefined) as ParsedDestinationParams
}

const ManageDestinationScreen: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryParams = parseSearchParams(searchParams)

  const [searchValue, setSearchValue] = useState(queryParams.search || '')
  // đồng bộ khi URL thay đổi (Back/Forward)
  useEffect(() => {
    setSearchValue(queryParams.search || '')
  }, [queryParams.search])

  // Danh sách điểm đến: phân trang + filter
  const { data, isLoading } = useQuery({
    queryKey: ['admin-destinations', queryParams],
    queryFn: () =>
      destinationAdminApi
        .getAdminDestinations(queryParams as DestinationAdminListParams)
        .then((res) => res.data),
    placeholderData: keepPreviousData
  })

  const destinations: DestinationAdmin[] = data?.content || []
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number ?? 0

  // Dữ liệu cho combobox filter (toàn bộ, không phân trang)
  const { data: allForFilter } = useQuery({
    queryKey: ['admin-destinations-filter-options'],
    queryFn: () => destinationAdminApi.getDestinationsForTour().then((res) => res.data)
  })

  const regionOptions = useMemo(
    () =>
      allForFilter
        ? Array.from(
            new Set(
              allForFilter.map((d) => d.region).filter((r): r is string => Boolean(r && r.trim()))
            )
          )
        : [],
    [allForFilter]
  )

  const locationOptions = useMemo(
    () =>
      allForFilter
        ? Array.from(
            new Set(
              allForFilter.map((d) => d.location).filter((l): l is string => Boolean(l && l.trim()))
            )
          )
        : [],
    [allForFilter]
  )

  const handlePageChange = (page: number) => {
    const newParams = { ...queryParams, page }
    setSearchParams(newParams as any)
  }

  const updateParams = (patch: Partial<ParsedDestinationParams>) => {
    const merged = omitBy(
      {
        ...queryParams,
        ...patch
      },
      (v) => v === undefined || v === ''
    )
    setSearchParams(merged as any)
  }

  // Thao tác
  const handleDetail = (id: string) => {
    navigate(`/admin/manage-destination/detail/${id}`)
  }

  const handleEdit = (id: string) => {
    navigate(`/admin/manage-destination/${id}/edit`)
  }

  const handleCreate = () => {
    navigate('/admin/manage-destination/new')
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý điểm đến</h1>
          <p className="text-gray-500 mt-1">Danh sách điểm đến trong hệ thống</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-6 py-3 rounded-lg shadow-lg transition-all active:scale-95"
        >
          + Tạo điểm đến mới
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white shadow-md rounded-xl p-5 flex flex-wrap items-center gap-4 mb-6">
        {/* Tìm kiếm theo tên điểm đến */}

        <input
          type="text"
          placeholder="Tìm kiếm theo tên điểm đến..."
          value={searchValue}
          onChange={(e) => {
            const value = e.target.value
            setSearchValue(value)

            // cập nhật query param mỗi lần gõ
            updateParams({
              search: value || undefined, // rỗng thì bỏ param
              page: 0
            })
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Lọc theo khu vực (miền Bắc / Trung / Nam / ...) */}
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 min-w-[180px]"
          value={queryParams.region || ''}
          onChange={(e) =>
            updateParams({
              region: e.target.value || undefined,
              page: 0
            })
          }
        >
          <option value="">Tất cả khu vực</option>
          {regionOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Lọc theo địa điểm (tỉnh / thành phố / khu vực cụ thể) */}
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 min-w-[180px]"
          value={queryParams.location || ''}
          onChange={(e) =>
            updateParams({
              location: e.target.value || undefined,
              page: 0
            })
          }
        >
          <option value="">Tất cả địa điểm</option>
          {locationOptions.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-600 text-sm uppercase border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 font-bold text-black">Tên điểm đến</th>
              <th className="px-5 py-3 font-bold text-black">Địa điểm</th>
              <th className="px-5 py-3 font-bold text-black">Khu vực</th>
              <th className="px-5 py-3 font-bold text-black text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : destinations.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Không có điểm đến phù hợp.
                </td>
              </tr>
            ) : (
              destinations.map((des) => (
                <tr
                  key={des.destinationID}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                >
                  {/* <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                    {des.nameDes}
                  </td> */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={des.imageUrl}
                        alt={des.nameDes}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{des.nameDes}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm">{des.location || '-'}</td>
                  <td className="px-5 py-4 text-sm">{des.region || '-'}</td>

                  {/* Xem chi tiết */}
                  <td className="px-5 py-4 text-center text-sm">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleDetail(des.destinationID)}
                        className="border border-gray-400 text-gray-600 rounded-lg p-2 hover:bg-gray-50"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Sửa */}
                      <button
                        onClick={() => handleEdit(des.destinationID)}
                        className="border border-blue-500 text-blue-500 rounded-lg p-2 hover:bg-blue-50"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
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
    </div>
  )
}

export default ManageDestinationScreen

