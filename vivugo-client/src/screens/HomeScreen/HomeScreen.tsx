import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import HeroSection from '../../components/home/HeroSection'
import CategoryQuickNav from '../../components/home/CategoryQuickNav'
import HomeFilterBar from '../../components/HomeFilterBar/HomeFilterBar'
import {
  FeaturedToursSection,
  TrendingToursSection,
  BestDealsSection
} from '../../components/home/TourShowcaseSection'
import DestinationsMasonry from '../../components/home/DestinationsMasonry'
import AnimateSection from '../../components/home/AnimateSection'
import {
  FaShieldAlt,
  FaTag,
  FaHeadset,
  FaHandshake,
  FaStar,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaLeaf,
  FaUserFriends,
  FaEnvelope
} from 'react-icons/fa'

const trustFeatures = [
  { icon: FaTag, title: 'Giá minh bạch', desc: 'Không phí ẩn, báo giá rõ từng hạng mục.', gradient: 'from-green-500 to-emerald-400' },
  { icon: FaShieldAlt, title: 'Hoàn tiền', desc: 'Chính sách hủy linh hoạt theo từng tour.', gradient: 'from-blue-500 to-cyan-400' },
  { icon: FaHeadset, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ tư vấn sẵn sàng trước và trong chuyến đi.', gradient: 'from-purple-500 to-indigo-400' },
  { icon: FaHandshake, title: 'Đối tác uy tín', desc: 'Hợp tác nhà cung cấp được kiểm duyệt chất lượng.', gradient: 'from-orange-500 to-amber-400' }
]

const testimonialData = [
  {
    id: 1,
    quote:
      'Một trải nghiệm tuyệt vời. Mọi thứ từ xe, khách sạn đến HDV đều chu đáo. Chắc chắn sẽ tiếp tục ủng hộ ViVuGo!',
    image: 'https://i.pravatar.cc/150?img=12',
    name: 'Nguyễn Minh Anh',
    tour: 'Tour Hạ Long Bay Luxury 3N2Đ'
  },
  {
    id: 2,
    quote:
      'Gia đình có kỷ niệm đáng nhớ tại Hội An. Lịch trình hợp lý cho cả người già và trẻ em.',
    image: 'https://i.pravatar.cc/150?img=11',
    name: 'Trần Văn Hùng',
    tour: 'Tour Đà Nẵng - Hội An 4N3Đ'
  }
]

function WhyChooseUs() {
  return (
    <AnimateSection className="py-20 md:py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-70 -translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">Why Choose ViVuGo?</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Kết hợp UX đặt tour hiện đại và cảm giác premium — minh bạch, an tâm, tiện lợi.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-[var(--vivugo-radius)] p-8 shadow-[var(--vivugo-shadow)] border border-gray-100 hover:-translate-y-1 transition-transform"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} text-white flex items-center justify-center mb-5`}
              >
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimateSection>
  )
}

function UniqueExperience() {
  return (
    <AnimateSection className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/tours?search=thiên nhiên"
            className="relative h-[360px] rounded-[var(--vivugo-radius)] overflow-hidden shadow-[var(--vivugo-shadow)] group"
          >
            <img
              src="./dulichmaohiem.avif"
              alt=""
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <FaLeaf className="mb-3" size={28} />
              <h3 className="text-3xl font-bold">Thiên Nhiên</h3>
            </div>
          </Link>
          <Link
            to="/tours?search=ẩm thực"
            className="relative h-[360px] rounded-[var(--vivugo-radius)] overflow-hidden shadow-[var(--vivugo-shadow)] group"
          >
            <img
              src="./khamphaamthuc.avif"
              alt=""
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <FaUserFriends className="mb-3" size={28} />
              <h3 className="text-3xl font-bold">Văn Hóa & Ẩm Thực</h3>
            </div>
          </Link>
        </div>
      </div>
    </AnimateSection>
  )
}

function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <AnimateSection className="py-20 bg-gray-900 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="text-yellow-400 font-bold text-sm bg-yellow-400/10 border border-yellow-400/20 px-4 py-1.5 rounded-full">
            Đánh giá thực tế
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4">Customer Reviews</h2>
        </div>
        <div className="max-w-4xl mx-auto relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[var(--vivugo-radius)] p-8 md:p-12 min-h-[300px]">
          <FaQuoteLeft className="text-5xl text-white/20 absolute top-6 left-6" />
          {testimonialData.map((item, index) => (
            <div
              key={item.id}
              className={`text-center transition-all duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0 p-8 pointer-events-none'
              }`}
            >
              <p className="text-lg md:text-xl italic text-gray-100 mb-6">"{item.quote}"</p>
              <img src={item.image} alt="" className="w-16 h-16 rounded-full mx-auto border-4 border-blue-500 mb-3" />
              <h4 className="font-bold text-white">{item.name}</h4>
              <p className="text-blue-300 text-sm">{item.tour}</p>
              <div className="flex justify-center gap-1 text-yellow-400 mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={14} />
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-between absolute top-1/2 -translate-y-1/2 left-2 right-2">
            <button
              type="button"
              onClick={() =>
                setCurrentSlide((p) => (p === 0 ? testimonialData.length - 1 : p - 1))
              }
              className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentSlide((p) => (p === testimonialData.length - 1 ? 0 : p + 1))
              }
              className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </AnimateSection>
  )
}

function Newsletter() {
  return (
    <AnimateSection className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          whileInView={{ scale: [0.98, 1] }}
          viewport={{ once: true }}
          className="vivugo-gradient-brand rounded-[var(--vivugo-radius)] p-10 md:p-14 text-center text-white shadow-2xl relative overflow-hidden"
        >
          <FaEnvelope className="text-4xl mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Sẵn sàng cho chuyến đi tiếp theo?
          </h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Đăng ký nhận voucher 15% và cẩm nang du lịch độc quyền.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto bg-white/10 p-2 rounded-full border border-white/25">
            <input
              type="email"
              required
              placeholder="Email của bạn"
              className="flex-1 bg-transparent px-5 py-3 text-white placeholder-blue-200 outline-none min-w-0"
            />
            <button
              type="submit"
              className="bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Đăng ký ngay
            </button>
          </form>
        </motion.div>
      </div>
    </AnimateSection>
  )
}

export default function HomeScreen() {
  return (
    <div className="bg-white w-full overflow-x-hidden">
      <HeroSection />
      <CategoryQuickNav />
      <HomeFilterBar />
      <FeaturedToursSection />
      <TrendingToursSection />
      <BestDealsSection />
      <DestinationsMasonry />
      <WhyChooseUs />
      <UniqueExperience />
      <Testimonials />
      <Newsletter />
    </div>
  )
}
