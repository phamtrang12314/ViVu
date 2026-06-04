import { useState } from 'react'
import { Link } from 'react-router-dom'
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
import HeroSection from '../../components/home/HeroSection'
import CategoryQuickNav from '../../components/home/CategoryQuickNav'
import {
  FeaturedToursSection,
  TrendingToursSection,
  BestDealsSection
} from '../../components/home/TourShowcaseSection'
import DestinationsMasonry from '../../components/home/DestinationsMasonry'
import TravelGuideSection from '../../components/home/TravelGuideSection'
import AnimateSection from '../../components/home/AnimateSection'

const trustFeatures = [
  {
    icon: FaTag,
    title: 'Giá minh bạch',
    desc: 'Không phí ẩn, hiển thị rõ từng hạng mục trước khi đặt.',
    gradient: 'from-green-500 to-emerald-400'
  },
  {
    icon: FaShieldAlt,
    title: 'Hoàn tiền rõ ràng',
    desc: 'Chính sách hủy và hoàn tiền được công bố theo từng tour.',
    gradient: 'from-blue-500 to-cyan-400'
  },
  {
    icon: FaHeadset,
    title: 'Hỗ trợ 24/7',
    desc: 'Đội ngũ tư vấn hỗ trợ trước, trong và sau chuyến đi.',
    gradient: 'from-purple-500 to-indigo-400'
  },
  {
    icon: FaHandshake,
    title: 'Đối tác uy tín',
    desc: 'Nhà cung cấp được kiểm duyệt chất lượng định kỳ.',
    gradient: 'from-orange-500 to-amber-400'
  }
]

const testimonialData = [
  {
    id: 1,
    quote:
      'Một trải nghiệm rất trọn vẹn. Xe, khách sạn và hướng dẫn viên đều đúng như mô tả, lịch trình cân bằng.',
    image: 'https://i.pravatar.cc/150?img=12',
    name: 'Nguyễn Minh Anh',
    tour: 'Vịnh Hạ Long 2N1Đ'
  },
  {
    id: 2,
    quote: 'Đi cùng gia đình có trẻ nhỏ vẫn thoải mái vì lịch đi hợp lý và có hỗ trợ tốt.',
    image: 'https://i.pravatar.cc/150?img=11',
    name: 'Trần Văn Hùng',
    tour: 'Đà Nẵng - Hội An 4N3Đ'
  }
]

function WhyChooseUs() {
  return (
    <AnimateSection className="relative overflow-hidden bg-slate-50 py-20 md:py-24">
      <div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-100 opacity-70 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-5xl">Vì sao chọn ViVuGo?</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-500">
            Trải nghiệm đặt tour mạch lạc, rõ giá, dễ so sánh và dễ ra quyết định.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[var(--vivugo-radius)] border border-gray-100 bg-white p-8 shadow-[var(--vivugo-shadow)] transition-transform hover:-translate-y-1"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white`}
              >
                <feature.icon size={24} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimateSection>
  )
}

function UniqueExperience() {
  return (
    <AnimateSection className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link
            to="/tours?search=thiên nhiên"
            className="group relative h-[360px] overflow-hidden rounded-[var(--vivugo-radius)] shadow-[var(--vivugo-shadow)]"
          >
            <img
              src="./dulichmaohiem.avif"
              alt="Thiên nhiên"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <FaLeaf className="mb-3" size={28} />
              <h3 className="text-3xl font-bold">Thiên nhiên</h3>
            </div>
          </Link>
          <Link
            to="/tours?search=ẩm thực"
            className="group relative h-[360px] overflow-hidden rounded-[var(--vivugo-radius)] shadow-[var(--vivugo-shadow)]"
          >
            <img
              src="./khamphaamthuc.avif"
              alt="Văn hóa và ẩm thực"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <FaUserFriends className="mb-3" size={28} />
              <h3 className="text-3xl font-bold">Văn hóa & Ẩm thực</h3>
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
    <AnimateSection className="relative overflow-hidden bg-gray-900 py-20">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-1.5 text-sm font-bold text-yellow-400">
            Đánh giá thực tế
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white md:text-5xl">Khách hàng nói gì?</h2>
        </div>
        <div className="relative mx-auto min-h-[300px] max-w-4xl rounded-[var(--vivugo-radius)] border border-white/20 bg-white/10 p-8 backdrop-blur-xl md:p-12">
          <FaQuoteLeft className="absolute left-6 top-6 text-5xl text-white/20" />
          {testimonialData.map((item, index) => (
            <div
              key={item.id}
              className={`text-center transition-all duration-500 ${
                index === currentSlide ? 'opacity-100' : 'pointer-events-none absolute inset-0 p-8 opacity-0'
              }`}
            >
              <p className="mb-6 text-lg italic text-gray-100 md:text-xl">"{item.quote}"</p>
              <img src={item.image} alt={item.name} className="mx-auto mb-3 h-16 w-16 rounded-full border-4 border-blue-500" />
              <h4 className="font-bold text-white">{item.name}</h4>
              <p className="text-sm text-blue-300">{item.tour}</p>
              <div className="mt-2 flex justify-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, starIndex) => (
                  <FaStar key={starIndex} size={14} />
                ))}
              </div>
            </div>
          ))}
          <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 justify-between">
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? testimonialData.length - 1 : prev - 1))}
              className="rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev === testimonialData.length - 1 ? 0 : prev + 1))}
              className="rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
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
    <AnimateSection className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className="vivugo-gradient-brand relative overflow-hidden rounded-[var(--vivugo-radius)] p-10 text-center text-white shadow-2xl md:p-14"
        >
          <FaEnvelope className="mx-auto mb-4 text-4xl opacity-80" />
          <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">Sẵn sàng cho chuyến đi tiếp theo?</h2>
          <p className="mx-auto mb-8 max-w-lg text-blue-100">Đăng ký nhận ưu đãi mới và cẩm nang du lịch mới nhất mỗi tuần.</p>
          <form className="mx-auto flex max-w-md flex-col gap-2 rounded-full border border-white/25 bg-white/10 p-2 sm:flex-row">
            <input
              type="email"
              required
              placeholder="Email của bạn"
              className="min-w-0 flex-1 bg-transparent px-5 py-3 text-white placeholder-blue-200 outline-none"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-full bg-white px-8 py-3 font-bold text-blue-700 transition-colors hover:bg-blue-50"
            >
              Đăng ký ngay
            </button>
          </form>
        </div>
      </div>
    </AnimateSection>
  )
}

export default function HomeScreen() {
  return (
    <div className="w-full overflow-x-hidden bg-white">
      <HeroSection />
      <CategoryQuickNav />
      <FeaturedToursSection />
      <DestinationsMasonry />
      <BestDealsSection />
      <TrendingToursSection />
      <WhyChooseUs />
      <UniqueExperience />
      <Testimonials />
      <TravelGuideSection />
      <Newsletter />
    </div>
  )
}
