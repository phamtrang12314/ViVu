import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { destinationApi } from '../../apis/destination'
import { tourTypeApi } from '../../apis/tourType.api'
import { FaSearch, FaFilter } from 'react-icons/fa'

const PRICE_RANGES = [
  { label: 'Tất cả giá', min: '', max: '' },
  { label: 'Dưới 5 triệu', min: '0', max: '5000000' },
  { label: '5 – 10 triệu', min: '5000000', max: '10000000' },
  { label: '10 – 20 triệu', min: '10000000', max: '20000000' },
  { label: 'Trên 20 triệu', min: '20000000', max: '' }
]

const DURATIONS = [
  { label: 'Thời gian', min: '', max: '' },
  { label: '1–3 ngày', min: '1', max: '3' },
  { label: '4–6 ngày', min: '4', max: '6' },
  { label: '7+ ngày', min: '7', max: '' }
]

const RATINGS = [
  { label: 'Đánh giá', value: '' },
  { label: '4+ sao', value: '4' },
  { label: '4.5+ sao', value: '4.5' }
]

export default function HomeFilterBar() {
  const navigate = useNavigate()
  const [region, setRegion] = useState('')
  const [tourTypeId, setTourTypeId] = useState('')
  const [priceIdx, setPriceIdx] = useState(0)
  const [durationIdx, setDurationIdx] = useState(0)
  const [minRating, setMinRating] = useState('')

  const { data: destinationsData } = useQuery({
    queryKey: ['destinations-filter'],
    queryFn: destinationApi.getPopularDestinations
  })

  const { data: tourTypesData } = useQuery({
    queryKey: ['tourTypes-filter'],
    queryFn: tourTypeApi.getTourTypes
  })

  const regions = [
    ...new Set((destinationsData?.data || []).map((d) => d.region).filter(Boolean))
  ].sort()

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (region) params.set('region', region)
    if (tourTypeId) params.set('tour_type_id', tourTypeId)
    const price = PRICE_RANGES[priceIdx]
    if (price.min) params.set('price_min', price.min)
    if (price.max) params.set('price_max', price.max)
    const dur = DURATIONS[durationIdx]
    if (dur.min) params.set('duration_min', dur.min)
    if (dur.max) params.set('duration_max', dur.max)
    if (minRating) params.set('sort', 'ranking,asc')
    navigate(`/tours?${params.toString()}`)
  }

  const selectClass =
    'w-full px-3 py-2.5 bg-slate-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer'

  return (
    <div
      id="home-filter-bar"
      className="sticky top-[72px] z-40 border-b border-gray-100/80 bg-white/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-sm font-bold text-gray-500 shrink-0">
            <FaFilter className="text-blue-600" />
            Lọc nhanh
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 flex-1">
            <select
              className={selectClass}
              value={priceIdx}
              onChange={(e) => setPriceIdx(Number(e.target.value))}
              aria-label="Giá"
            >
              {PRICE_RANGES.map((p, i) => (
                <option key={p.label} value={i}>
                  {p.label}
                </option>
              ))}
            </select>
            <select
              className={selectClass}
              value={durationIdx}
              onChange={(e) => setDurationIdx(Number(e.target.value))}
              aria-label="Thời gian"
            >
              {DURATIONS.map((d, i) => (
                <option key={d.label} value={i}>
                  {d.label}
                </option>
              ))}
            </select>
            <select
              className={selectClass}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              aria-label="Vùng miền"
            >
              <option value="">Vùng miền</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              className={selectClass}
              value={tourTypeId}
              onChange={(e) => setTourTypeId(e.target.value)}
              aria-label="Loại hình"
            >
              <option value="">Loại hình</option>
              {tourTypesData?.data.map((t) => (
                <option key={t.tourTypeID} value={t.tourTypeID}>
                  {t.nameType}
                </option>
              ))}
            </select>
            <select
              className={selectClass}
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              aria-label="Đánh giá"
            >
              {RATINGS.map((r) => (
                <option key={r.label} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={applyFilters}
            className="shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm vivugo-gradient-brand shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <FaSearch size={14} />
            Tìm tour
          </button>
        </div>
      </div>
    </div>
  )
}
