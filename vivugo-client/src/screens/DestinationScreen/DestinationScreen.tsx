import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Search, Sparkles } from 'lucide-react'
import { destinationApi } from '../../apis/destination'

const resolveImage = (url?: string) => {
  if (!url) return 'https://placehold.co/900x640/E0F2FE/075985?text=ViVuGo'
  if (url.startsWith('http')) return url
  return url
}

export default function DestinationScreen() {
  const [activeRegion, setActiveRegion] = useState('all')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['destinations'],
    queryFn: destinationApi.getPopularDestinations
  })

  const destinations = useMemo(() => data?.data || [], [data])

  const regions = useMemo(
    () => ['all', ...Array.from(new Set(destinations.map((item) => item.region).filter(Boolean)))],
    [destinations]
  )

  const filteredDestinations = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return destinations.filter((item) => {
      const matchesRegion = activeRegion === 'all' || item.region === activeRegion
      const matchesSearch =
        !keyword ||
        [item.nameDes, item.location, item.country, item.region]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(keyword))
      return matchesRegion && matchesSearch
    })
  }, [activeRegion, destinations, search])

  const heroImage = destinations[0]?.imageURLs?.[0] || '/images/destinations/halong01_des.jpg'

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <section className="relative min-h-[420px] overflow-hidden pt-28">
        <img src={resolveImage(heroImage)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/68 via-black/36 to-slate-50" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/16 px-4 py-2 text-sm font-bold backdrop-blur-xl">
              <Sparkles size={16} />
              Khám phá Việt Nam
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
              Điểm đến nổi bật cho chuyến đi tiếp theo
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium text-white/84 md:text-lg">
              Lọc theo vùng miền, xem số tour đang có và đi thẳng tới danh sách tour phù hợp.
            </p>
          </div>

          <div className="mt-10 max-w-4xl rounded-[28px] border border-white/40 bg-white/22 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_24px_60px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
            <div className="flex flex-col gap-3 rounded-[22px] border border-white/70 bg-white/48 p-3 backdrop-blur-xl md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tìm Hà Nội, Đà Nẵng, Sa Pa..."
                  className="h-12 w-full rounded-2xl border border-white/70 bg-white/48 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none backdrop-blur-xl transition focus:bg-white/70 focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                {regions.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setActiveRegion(String(region))}
                    className={`h-12 shrink-0 rounded-2xl border px-5 text-sm font-bold transition ${
                      activeRegion === region
                        ? 'border-white bg-white/72 text-blue-700 shadow-sm'
                        : 'border-white/60 bg-white/28 text-slate-600 hover:bg-white/55'
                    }`}
                  >
                    {region === 'all' ? 'Tất cả' : region}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="rounded-[28px] border border-white bg-white/76 p-12 text-center shadow-sm backdrop-blur-xl">
            <h2 className="text-2xl font-black text-slate-900">Chưa tìm thấy điểm đến phù hợp</h2>
            <p className="mt-2 text-slate-500">Hãy thử đổi vùng miền hoặc từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredDestinations.map((destination, index) => {
              const image = resolveImage(destination.imageURLs?.[0])
              const featured = index === 0
              return (
                <Link
                  key={destination.destinationID}
                  to={`/tours?destination_id=${destination.destinationID}`}
                  className={`group relative min-h-[320px] overflow-hidden rounded-[28px] border border-white bg-white/70 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.14)] ${
                    featured ? 'md:col-span-2' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={destination.nameDes}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.src = 'https://placehold.co/900x640/E0F2FE/075985?text=Destination'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/20 to-black/76" />
                  <div className="absolute left-5 top-5 rounded-full border border-white/35 bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-xl">
                    {destination.region || 'Việt Nam'}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h2 className="text-2xl font-black">{destination.nameDes}</h2>
                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-white/82">
                      <MapPin size={16} />
                      <span>{destination.location || destination.country || 'Việt Nam'}</span>
                    </div>
                    <div className="mt-5 inline-flex rounded-2xl border border-white/40 bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur-xl">
                      {destination.tourCount} tour đang mở
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

