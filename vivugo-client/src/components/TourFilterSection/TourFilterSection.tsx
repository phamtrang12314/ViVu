// frontend-demo/src/components/TourFilterSection/TourFilterSection.tsx

import { useEffect, useRef, useMemo } from 'react'
import type { TourListParams } from '../../types/tour'
import { useQuery } from '@tanstack/react-query'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { tourTypeApi } from '../../apis/tourType.api'
import { destinationApi } from '../../apis/destination'

// Import các Icon hiện đại
import {
  FaSearch,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaSortAmountDown,
  FaTimes,
  FaChevronDown
} from 'react-icons/fa'

type FormData = {
  search?: string
  destination_id?: string
  tour_type_id?: string
  sort?: string
}

const compactParams = <T extends Record<string, unknown>>(value?: T) =>
  Object.fromEntries(Object.entries(value || {}).filter(([, item]) => item !== undefined && item !== '')) as Partial<T>

const shallowEqual = (a?: Record<string, unknown>, b?: Record<string, unknown>) => {
  const left = compactParams(a)
  const right = compactParams(b)
  const keys = new Set([...Object.keys(left), ...Object.keys(right)])
  for (const key of keys) {
    if (left[key] !== right[key]) return false
  }
  return true
}

interface Props {
  showAdvancedFilters?: boolean
  defaultValues?: FormData
}

export default function TourFilterSection({ showAdvancedFilters = false, defaultValues }: Props) {
  const navigate = useNavigate()
  const { register, handleSubmit, reset, watch } = useForm<FormData>({
    defaultValues: defaultValues
  })

  const watchedValues = watch()
  const isMounted = useRef(false)

  const { data: destinationsData } = useQuery({
    queryKey: ['destinations'],
    queryFn: destinationApi.getPopularDestinations
  })

  const { data: tourTypesData } = useQuery({
    queryKey: ['tourTypes'],
    queryFn: tourTypeApi.getTourTypes
  })

  useEffect(() => {
    if (!shallowEqual(defaultValues, watch())) {
      reset(defaultValues)
    }
  }, [defaultValues, reset, watch])

  const debouncedNavigate = useMemo(() => {
    let timeout: number | undefined
    const run = (newParams: TourListParams) => {
      window.clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        navigate({
          pathname: '/tours',
          search: createSearchParams(newParams as any).toString()
        })
      }, 500)
    }
    run.cancel = () => window.clearTimeout(timeout)
    return run
  }, [navigate])

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      if (shallowEqual(watchedValues, defaultValues)) {
        return
      }
    }
    const params = compactParams({ ...watchedValues }) as TourListParams
    debouncedNavigate(params)
    return () => {
      debouncedNavigate.cancel()
    }
  }, [watchedValues, debouncedNavigate, defaultValues])

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const params = compactParams({ ...data }) as TourListParams
    debouncedNavigate.cancel()
    navigate({
      pathname: '/tours',
      search: createSearchParams(params as any).toString()
    })
  }

  const handleResetFilters = () => {
    reset({
      search: '',
      destination_id: '',
      tour_type_id: '',
      sort: ''
    })
    debouncedNavigate.cancel()
    navigate('/tours')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full relative z-10">
      {/* Thanh tìm kiếm chính */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch
              className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
          </div>
          <input
            {...register('search')}
            type="text"
            placeholder="Bạn muốn khám phá nơi nào? (Vịnh Hạ Long, Sapa...)"
            className="w-full pl-12 pr-4 py-4 bg-white/42 backdrop-blur-xl border border-white/70 rounded-2xl text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/70 transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
          />
        </div>
        <button
          type="submit"
          className="bg-white/36 backdrop-blur-xl border border-white/70 hover:bg-white/56 text-blue-700 px-8 py-4 rounded-2xl font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_10px_24px_rgba(37,99,235,0.18)] transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 whitespace-nowrap"
        >
          <FaSearch size={16} />
          <span>Tìm kiếm</span>
        </button>
      </div>

      {/* Bộ lọc nâng cao */}
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cột 1: Điểm đến */}
            <div className="relative group">
              <label
                htmlFor="destination_id"
                className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1"
              >
                Điểm đến
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-blue-500/70" size={16} />
                </div>
                <select
                  {...register('destination_id')}
                  id="destination_id"
                  className="w-full pl-10 pr-10 py-3 bg-white/42 backdrop-blur-xl border border-white/70 rounded-xl text-gray-800 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/70 transition-all hover:bg-white/60"
                >
                  <option value="">Tất cả điểm đến</option>
                  {destinationsData?.data.map((dest) => (
                    <option key={dest.destinationID} value={dest.destinationID}>
                      {dest.nameDes}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <FaChevronDown className="text-gray-400" size={14} />
                </div>
              </div>
            </div>

            {/* Cột 2: Loại hình */}
            <div className="relative group">
              <label
                htmlFor="tour_type_id"
                className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1"
              >
                Loại hình
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FaLayerGroup className="text-purple-500/70" size={16} />
                </div>
                <select
                  {...register('tour_type_id')}
                  id="tour_type_id"
                  className="w-full pl-10 pr-10 py-3 bg-white/42 backdrop-blur-xl border border-white/70 rounded-xl text-gray-800 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/70 transition-all hover:bg-white/60"
                >
                  <option value="">Tất cả loại hình</option>
                  {tourTypesData?.data.map((type) => (
                    <option key={type.tourTypeID} value={type.tourTypeID}>
                      {type.nameType}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <FaChevronDown className="text-gray-400" size={14} />
                </div>
              </div>
            </div>

            {/* Cột 3: Sắp xếp */}
            <div className="relative group">
              <label
                htmlFor="sort"
                className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1"
              >
                Sắp xếp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FaSortAmountDown className="text-orange-500/70" size={16} />
                </div>
                <select
                  {...register('sort')}
                  id="sort"
                  className="w-full pl-10 pr-10 py-3 bg-white/42 backdrop-blur-xl border border-white/70 rounded-xl text-gray-800 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/70 transition-all hover:bg-white/60"
                >
                  <option value="">Mặc định (Nổi bật nhất)</option>
                  <option value="priceAdult,asc">Giá tour: Thấp đến Cao</option>
                  <option value="priceAdult,desc">Giá tour: Cao đến Thấp</option>
                  <option value="startDate,asc">Ngày khởi hành: Gần nhất</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <FaChevronDown className="text-gray-400" size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* Nút Xoá bộ lọc */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
            >
              <FaTimes size={12} />
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}
    </form>
  )
}

