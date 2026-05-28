import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaCalendarAlt, FaSearch, FaUserFriends } from 'react-icons/fa'

const HERO_VIDEO =
  'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beach-with-waves-1572-large.mp4'

export default function HeroSection() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState({
    destination: '',
    startDate: '',
    guests: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchParams.destination.trim()) params.append('search', searchParams.destination.trim())
    if (searchParams.startDate) params.append('startDate', searchParams.startDate)
    if (searchParams.guests) params.append('guests', searchParams.guests)
    navigate(`/tours?${params.toString()}`)
  }

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero.jpg"
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{ backgroundImage: 'url(/hero.jpg)' }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-sm font-semibold tracking-wide mb-6"
        >
          Hành trình tuyệt vời bắt đầu từ đây
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl tracking-tight leading-tight"
        >
          Khám phá Việt Nam
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400">
            cùng ViVuGo
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 font-light"
        >
          Đặt tour minh bạch, hỗ trợ 24/7 — hơn 10.000+ điểm đến đang chờ bạn.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3 }}
          className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-3 md:p-5 rounded-[var(--vivugo-radius)] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
        >
          <form
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3"
            onSubmit={handleSubmitSearch}
          >
            <div className="lg:col-span-5 bg-white rounded-2xl p-3 flex flex-col text-left focus-within:ring-2 focus-within:ring-blue-500">
              <label htmlFor="destination" className="text-[10px] font-bold text-gray-500 uppercase ml-8">
                Điểm đến
              </label>
              <div className="relative flex items-center">
                <FaMapMarkerAlt className="absolute left-2 text-blue-500" />
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  placeholder="Bạn muốn đi đâu?"
                  className="w-full pl-9 pr-2 py-1 bg-transparent outline-none text-gray-800 font-medium"
                  value={searchParams.destination}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="lg:col-span-3 bg-white rounded-2xl p-3 flex flex-col text-left focus-within:ring-2 focus-within:ring-blue-500">
              <label htmlFor="date" className="text-[10px] font-bold text-gray-500 uppercase ml-8">
                Ngày đi
              </label>
              <div className="relative flex items-center">
                <FaCalendarAlt className="absolute left-2 text-blue-500" />
                <input
                  type="date"
                  id="date"
                  name="startDate"
                  className="w-full pl-9 pr-2 py-1 bg-transparent outline-none text-gray-800 font-medium"
                  value={searchParams.startDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl p-3 flex flex-col text-left focus-within:ring-2 focus-within:ring-blue-500">
              <label htmlFor="guests" className="text-[10px] font-bold text-gray-500 uppercase ml-2">
                Số người
              </label>
              <div className="relative flex items-center">
                <FaUserFriends className="absolute left-2 text-blue-500 text-sm" />
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  min={1}
                  placeholder="2"
                  className="w-full pl-9 pr-2 py-1 bg-transparent outline-none text-gray-800 font-medium"
                  value={searchParams.guests}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="lg:col-span-2 flex">
              <button
                type="submit"
                className="w-full min-h-[52px] vivugo-gradient-brand text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <FaSearch />
                Tìm kiếm
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
