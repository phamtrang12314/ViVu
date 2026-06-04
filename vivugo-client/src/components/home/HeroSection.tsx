import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, MapPin, Search, Users } from 'lucide-react'
import { resolveAssetUrl } from '../../utils/utils'

const ROTATE_MS = 10000

const heroSlides = ['/hero.jpg', '/blog-01.avif', '/blog-02.jpg', '/blog-03.avif', '/dulichmaohiem.avif']

export default function HeroSection() {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [startDate, setStartDate] = useState('')
  const [travelers, setTravelers] = useState(2)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length)
    }, ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [])

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (keyword.trim()) params.set('search', keyword.trim())
    if (startDate) params.set('start_date', startDate)
    if (travelers > 0) params.set('travelers', String(travelers))
    navigate(`/tours?${params.toString()}`)
  }

  const activeImage = resolveAssetUrl(heroSlides[activeIndex], '/hero.jpg')

  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      <img
          key={activeImage}
          src={activeImage}
          alt="Khám phá Việt Nam"
          className="absolute inset-0 h-full w-full animate-hero-fade object-cover"
          fetchPriority="high"
        />

      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-800/35 to-slate-900/55" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-slate-100/20 to-white/95 backdrop-blur-[1px]" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl items-center justify-center px-4 pt-24 text-center sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <span className="inline-flex rounded-full border border-white/35 bg-white/14 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md">
            Hành trình tuyệt vời bắt đầu từ đây
          </span>

          <h1 className="mt-6 text-5xl font-black leading-tight text-white md:text-7xl">
            Khám phá Việt Nam
            <br />
            <span className="text-sky-400">cùng ViVuGo</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Đặt tour minh bạch, hỗ trợ 24/7 và nhiều hành trình phù hợp mọi nhu cầu.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-2 rounded-3xl border border-white/30 bg-white/14 p-3 shadow-[0_12px_40px_rgba(15,23,42,0.24)] backdrop-blur-xl md:grid-cols-[2fr_1fr_0.85fr_auto]"
          >
            <label className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/20 px-4 py-3 text-white backdrop-blur-md">
              <MapPin size={18} className="text-blue-200" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Bạn muốn đi đâu?"
                className="w-full bg-transparent text-sm font-medium placeholder-white/75 outline-none"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/20 px-4 py-3 text-white backdrop-blur-md">
              <CalendarDays size={18} className="text-blue-200" />
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full bg-transparent text-sm font-medium outline-none [color-scheme:dark]"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/20 px-4 py-3 text-white backdrop-blur-md">
              <Users size={18} className="text-blue-200" />
              <input
                type="number"
                min={1}
                max={20}
                value={travelers}
                onChange={(event) => setTravelers(Number(event.target.value) || 1)}
                className="w-full bg-transparent text-sm font-medium outline-none"
              />
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <Search size={16} />
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
