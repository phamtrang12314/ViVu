/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { tourApi } from '../../apis/tour'
import TourCard from '../../components/TourCard'
import TourFilterSection from '../../components/TourFilterSection'
import type { Tour, TourListParams } from '../../types/tour'
import Button from '../../components/Button'
import { destinationApi } from '../../apis/destination'
import { useMemo } from 'react'
import { FaChevronLeft, FaChevronRight, FaCompass } from 'react-icons/fa'

type ParsedTourParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  region: any
  page: number
  size: number
  sort?: string
  search?: string
  destination_id?: string
  tour_type_id?: string
  priceMin?: number
  priceMax?: number
  deals_only?: boolean
  duration_min?: number
  duration_max?: number
}

const removeUndefined = <T extends Record<string, unknown>>(value: T) =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as Partial<T>

const parseSearchParams = (searchParams: URLSearchParams): ParsedTourParams => {
  const params = {
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    size: searchParams.get('size') ? Number(searchParams.get('size')) : 12,
    sort: searchParams.get('sort') || undefined,
    search: searchParams.get('search') || undefined,
    destination_id: searchParams.get('destination_id') || undefined,
    tour_type_id: searchParams.get('tour_type_id') || undefined,
    priceMin: searchParams.get('price_min')
      ? Number(searchParams.get('price_min'))
      : searchParams.get('priceMin')
        ? Number(searchParams.get('priceMin'))
        : undefined,
    priceMax: searchParams.get('price_max')
      ? Number(searchParams.get('price_max'))
      : searchParams.get('priceMax')
        ? Number(searchParams.get('priceMax'))
        : undefined,
    region: searchParams.get('region') || undefined,
    deals_only: searchParams.get('deals_only') === 'true' ? true : undefined,
    duration_min: searchParams.get('duration_min')
      ? Number(searchParams.get('duration_min'))
      : undefined,
    duration_max: searchParams.get('duration_max')
      ? Number(searchParams.get('duration_max'))
      : undefined
  }
  return removeUndefined(params) as ParsedTourParams
}

const toApiParams = (p: ParsedTourParams): TourListParams =>
  removeUndefined({
    page: p.page,
    size: p.size,
    sort: p.sort,
    search: p.search,
    destination_id: p.destination_id,
    tour_type_id: p.tour_type_id,
    region: p.region,
    price_min: p.priceMin,
    price_max: p.priceMax,
    deals_only: p.deals_only,
    duration_min: p.duration_min,
    duration_max: p.duration_max
  }) as TourListParams

export default function TourScreen() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParams = parseSearchParams(searchParams)

  const { data: destinationsData } = useQuery({
    queryKey: ['destinations'],
    queryFn: destinationApi.getPopularDestinations
  })

  const uniqueRegions = useMemo(() => {
    if (!destinationsData?.data) return []
    const regions = destinationsData.data.map((dest) => dest.region)
    return [...new Set(regions)].filter(Boolean).sort()
  }, [destinationsData])

  const { data: toursData, isLoading } = useQuery({
    queryKey: ['tours', queryParams],
    queryFn: () => tourApi.getTours(toApiParams(queryParams)),
    placeholderData: keepPreviousData
  })

  const tours = toursData?.data.content || []
  const totalPages = toursData?.data.totalPages || 0
  const currentPage = toursData?.data.number || 0

  const handlePageChange = (page: number) => {
    const newParams = { ...queryParams, page: page }
    setSearchParams(newParams as any)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const handleRegionClick = (regionValue: string | undefined) => {
    const newParams = {
      ...queryParams,
      region: regionValue,
      page: 0
    }
    const cleanedParams = removeUndefined(newParams)
    setSearchParams(cleanedParams as any)
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      {/* HERO SECTION (Premium Glassmorphism) */}
      <div className="relative pt-24 pb-32 overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero.jpg)', backgroundAttachment: 'fixed' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/38 to-[#f8fafc]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold tracking-wider uppercase mb-4 shadow-lg">
              <FaCompass /> Hành trình của bạn
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500 pb-8 drop-shadow-lg">
              Tìm Kiếm Chuyến Đi Hoàn Hảo
            </h1>
            {/* <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl tracking-tight">
              Tìm Kiếm Chuyến Đi Hoàn Hảo
            </h1> */}
          </div>

          {/* Filter Section bọc trong Glassmorphism */}
          <div className="bg-white/16 backdrop-blur-2xl border border-white/35 p-2 md:p-4 rounded-[2rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_22px_60px_rgba(15,23,42,0.24)] mx-auto max-w-5xl">
            <div className="bg-white/46 backdrop-blur-xl border border-white/70 rounded-[1.5rem] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
              <TourFilterSection showAdvancedFilters={true} defaultValues={queryParams} />
            </div>
          </div>
        </div>
      </div>

      {/* VÙNG MIỀN (Pill Navigation) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-12">
        <div className="bg-white/48 backdrop-blur-xl p-2 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_16px_42px_rgba(15,23,42,0.08)] border border-white/80 flex flex-wrap gap-2 justify-center items-center">
          <button
            onClick={() => handleRegionClick(undefined)}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
              queryParams.region === undefined || queryParams.region === ''
                ? 'bg-white/70 text-blue-700 border border-white shadow-md transform scale-105 backdrop-blur-xl'
                : 'bg-white/20 border border-transparent text-gray-600 hover:bg-white/55 hover:border-white hover:text-blue-600'
            }`}
          >
            Tất cả điểm đến
          </button>
          {uniqueRegions.map((region) => (
            <button
              key={region}
              onClick={() => handleRegionClick(region)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                queryParams.region === region
                  ? 'bg-white/70 text-blue-700 border border-white shadow-md transform scale-105 backdrop-blur-xl'
                  : 'bg-white/20 border border-transparent text-gray-600 hover:bg-white/55 hover:border-white hover:text-blue-600'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH TOURS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {tours.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {tours.map((tour: Tour) => (
                    <div key={tour.tourID} className="h-full">
                      <TourCard tour={tour} />
                    </div>
                  ))}
                </div>

                {/* PHÂN TRANG (Pagination Premium) */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-16">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="!rounded-full w-12 h-12 !p-0 flex items-center justify-center"
                    >
                      <FaChevronLeft />
                    </Button>

                    <div className="bg-white border border-gray-200 shadow-sm px-6 py-3 rounded-full font-bold text-gray-700">
                      Trang <span className="text-blue-600">{currentPage + 1}</span> / {totalPages}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage + 1 >= totalPages}
                      className="!rounded-full w-12 h-12 !p-0 flex items-center justify-center"
                    >
                      <FaChevronRight />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-gray-100 max-w-3xl mx-auto mt-10">
                <img
                  src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png"
                  alt="Empty"
                  className="w-64 mx-auto mb-6 opacity-80"
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                <p className="text-gray-500 mb-6">
                  Chúng tôi không tìm thấy tour nào phù hợp với bộ lọc của bạn. Hãy thử thay đổi
                  điểm đến hoặc thời gian nhé!
                </p>
                <Button onClick={() => handleRegionClick(undefined)} className="mx-auto">
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
