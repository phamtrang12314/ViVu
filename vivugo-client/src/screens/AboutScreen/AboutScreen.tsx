import React from 'react'
import {
  FaGraduationCap,
  FaMedal,
  FaShieldAlt,
  FaStar,
  FaTags,
  FaTrophy,
  FaUsers,
  FaHeart,
  FaCompass,
  FaArrowRight
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

// Data Cứng cho các phần tử
const milestones = [
  {
    value: '10+',
    label: 'Năm kinh nghiệm',
    icon: FaStar,
    gradient: 'from-amber-400 to-orange-500'
  },
  {
    value: '50K+',
    label: 'Khách hàng hài lòng',
    icon: FaUsers,
    gradient: 'from-blue-400 to-indigo-500'
  },
  { value: '200+', label: 'Tour du lịch', icon: FaTags, gradient: 'from-emerald-400 to-teal-500' },
  {
    value: '4.9/5',
    label: 'Đánh giá trung bình',
    icon: FaHeart,
    gradient: 'from-pink-400 to-rose-500'
  }
]

const missionVision = [
  {
    title: 'Sứ Mệnh',
    desc: 'Mang đến những chuyến du lịch an toàn, chất lượng và đáng nhớ, góp phần quảng bá văn hóa và vẻ đẹp đất nước Việt Nam tới bạn bè quốc tế.',
    icon: FaShieldAlt,
    gradient: 'from-blue-600 to-cyan-500'
  },
  {
    title: 'Tầm Nhìn',
    desc: 'Trở thành công ty du lịch hàng đầu Việt Nam, được khách hàng tin tưởng lựa chọn hàng đầu khi khám phá vẻ đẹp và văn hóa Việt Nam.',
    icon: FaCompass,
    gradient: 'from-purple-600 to-indigo-500'
  }
]

const coreValues = [
  { title: 'An Toàn', desc: 'Đảm bảo an toàn tuyệt đối cho hành khách trong suốt chuyến đi.' },
  {
    title: 'Chất Lượng',
    desc: 'Cam kết cung cấp dịch vụ chất lượng cao với đội ngũ chuyên nghiệp.'
  },
  {
    title: 'Tận Tâm',
    desc: 'Phục vụ khách hàng với sự nhiệt huyết và tinh thần trách nhiệm cao nhất.'
  }
]

const leaders = [
  {
    name: 'Phạm Thùy Trang',
    title: 'Thành viên sáng lập & CEO',
    desc: 'Chuyên gia Du lịch Top 10',
    image: '/PhamTrang.jpg'
  },
  {
    name: 'Trần Thị Khánh Huyền',
    title: 'Trưởng phòng đại diện',
    desc: 'Chiến lược Digital Marketing',
    image: '/TranKhanhHuyen.jpg'
  },
  {
    name: 'Nguyễn Thị Thái Hòa',
    title: 'Trưởng phòng Tour',
    desc: 'Chuyên gia thiết kế Tour',
    image: '/uifaces-human-avatar (2).jpg'
  },
  {
    name: 'Hoàng Thị Thanh Thúy',
    title: 'Trưởng phòng CSKH',
    desc: 'Tận tâm, chu đáo với khách hàng',
    image: '/uifaces-human-avatar (1).jpg'
  }
]

const awards = [
  { icon: FaTrophy, label: 'Top 10', desc: 'Công ty du lịch tốt nhất 2025' },
  { icon: FaMedal, label: 'ISO 9001', desc: 'Chứng nhận chất lượng quốc tế' },
  { icon: FaStar, label: 'VITA', desc: 'Giải thưởng VITA uy tín' },
  { icon: FaGraduationCap, label: '5 Sao', desc: 'Đạt chuẩn 5 sao dịch vụ' }
]

// --- Các Component nhỏ ---

const SectionTitle: React.FC<{ title: string; subtitle?: string; badge?: string }> = ({
  title,
  subtitle,
  badge
}) => (
  <div className="text-center mb-16">
    {badge && (
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold tracking-wider uppercase mb-4 shadow-sm">
        {badge}
      </span>
    )}
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{title}</h2>
    {subtitle && <p className="text-lg text-gray-500 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
)

const MilestoneCard: React.FC<{ data: (typeof milestones)[number] }> = ({ data }) => (
  <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-[2rem] text-center transform hover:-translate-y-2 transition-all duration-300 shadow-xl">
    <div
      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${data.gradient} flex items-center justify-center mb-6 shadow-lg`}
    >
      <data.icon className="text-white text-3xl" />
    </div>
    <p className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">
      {data.value}
    </p>
    <p className="text-blue-100 font-medium uppercase tracking-wide text-sm">{data.label}</p>
  </div>
)

const MissionVisionCard: React.FC<{ data: (typeof missionVision)[number] }> = ({ data }) => (
  <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] transition-all duration-500 border border-gray-100 group">
    <div
      className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${data.gradient} flex items-center justify-center mb-8 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}
    >
      <data.icon className="text-white text-4xl" />
    </div>
    <h3 className="text-3xl font-extrabold text-gray-900 mb-4">{data.title}</h3>
    <p className="text-gray-600 text-lg leading-relaxed">{data.desc}</p>
  </div>
)

const CoreValueCard: React.FC<{ data: (typeof coreValues)[number]; index: number }> = ({
  data,
  index
}) => {
  const iconMap = [FaShieldAlt, FaStar, FaHeart]
  const gradientMap = [
    'from-green-400 to-emerald-600',
    'from-amber-400 to-orange-500',
    'from-rose-400 to-red-600'
  ]
  const Icon = iconMap[index % iconMap.length]
  const gradient = gradientMap[index % gradientMap.length]

  return (
    <div className="bg-white text-center p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
      <div
        className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-md`}
      >
        <Icon className="text-white text-3xl transform group-hover:scale-110 transition-transform" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{data.title}</h3>
      <p className="text-gray-500 leading-relaxed">{data.desc}</p>
    </div>
  )
}

const LeaderCard: React.FC<{ data: (typeof leaders)[number] }> = ({ data }) => (
  <div className="bg-white p-6 rounded-[2rem] text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-50 group">
    <div className="w-40 h-40 mx-auto rounded-[2rem] overflow-hidden mb-6 p-1 bg-gradient-to-br from-blue-500 to-purple-600 group-hover:shadow-lg transition-all duration-300">
      <img
        src={data.image}
        alt={data.name}
        className="w-full h-full object-cover rounded-[1.8rem] border-4 border-white"
      />
    </div>
    <h4 className="text-xl font-bold text-gray-900 mb-1">{data.name}</h4>
    <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-bold mb-2">
      {data.title}
    </p>
    <p className="text-sm text-gray-500">{data.desc}</p>
  </div>
)

const AwardCard: React.FC<{ data: (typeof awards)[number]; index: number }> = ({ data, index }) => {
  const colorMap = [
    'text-amber-500 bg-amber-50',
    'text-blue-500 bg-blue-50',
    'text-emerald-500 bg-emerald-50',
    'text-purple-500 bg-purple-50'
  ]
  const color = colorMap[index % colorMap.length]

  return (
    <div className="bg-white p-6 rounded-[2rem] text-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div
        className={`w-16 h-16 mx-auto rounded-2xl ${color} flex items-center justify-center mb-4`}
      >
        <data.icon className="text-2xl" />
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-1">{data.label}</h4>
      <p className="text-sm text-gray-500">{data.desc}</p>
    </div>
  )
}

// --- Màn hình chính ---
export default function AboutScreen() {
  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* 1. HERO SECTION (Premium Glassmorphism) */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-out scale-105 duration-1000"
          style={{ backgroundImage: 'url(/hero.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-white" />

        <div className="relative z-10 text-center p-8 mt-10">
          <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold tracking-wider uppercase mb-6 shadow-lg inline-block">
            Về ViVuGo
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-xl tracking-tight">
            Khám Phá Thế Giới <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">
              Cùng Chúng Tôi
            </span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md font-light">
            Đồng hành cùng bạn trên mọi nẻo đường, tạo ra những kỷ niệm vô giá từ năm 2014.
          </p>
        </div>
      </div>

      {/* 2. CÂU CHUYỆN CỦA CHÚNG TÔI */}
      <div className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-[3rem] blur-2xl opacity-50"></div>
              <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                  alt="Đội ngũ ViVuGo"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div>
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm bg-blue-50 px-4 py-1.5 rounded-full mb-4 inline-block">
                Hành trình 10 năm
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Câu Chuyện Của{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Chúng Tôi
                </span>
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                ViVuGo được thành lập vào năm 2014 với niềm đam mê bất tận với du lịch và mong muốn
                giới thiệu vẻ đẹp của Việt Nam đến bạn bè quốc tế và du khách trong nước. Chúng tôi
                tin rằng mỗi chuyến đi không chỉ là sự di chuyển mà còn là một hành trình khám phá
                bản thân.
              </p>
              <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                Với hơn 10 năm kinh nghiệm, chúng tôi cam kết mang đến những dịch vụ chất lượng, an
                toàn và chuyên nghiệp nhất. Đội ngũ ViVuGo luôn làm việc tận tâm để mỗi chuyến đi
                đều trở nên hoàn hảo.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Kết nối ngay <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SỨ MỆNH & TẦM NHÌN */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Mục tiêu"
            title="Sứ Mệnh & Tầm Nhìn"
            subtitle="Định hướng phát triển bền vững và mang lại giá trị thực cho cộng đồng"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {missionVision.map((item, index) => (
              <MissionVisionCard key={index} data={item} />
            ))}
          </div>
        </div>
      </div>

      {/* 4. THÀNH TỰU (GLASSMORPHISM) */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0f1c]" />
        {/* Glow effects */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Những Con Số{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">
                Biết Nói
              </span>
            </h2>
            <p className="text-xl text-gray-400">Minh chứng cho sự nỗ lực không ngừng nghỉ</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <MilestoneCard key={index} data={milestone} />
            ))}
          </div>
        </div>
      </div>

      {/* 5. GIÁ TRỊ CỐT LÕI */}
      <div className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionTitle
            badge="Nguyên tắc"
            title="Giá Trị Cốt Lõi"
            subtitle="Những nguyên tắc không thay đổi định hình văn hóa ViVuGo"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((item, index) => (
              <CoreValueCard key={index} data={item} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* 6. ĐỘI NGŨ LÃNH ĐẠO */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Con người"
            title="Đội Ngũ Lãnh Đạo"
            subtitle="Những người dẫn dắt và tạo ra các trải nghiệm du lịch tuyệt vời"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.map((leader, index) => (
              <LeaderCard key={index} data={leader} />
            ))}
          </div>
        </div>
      </div>

      {/* 7. GIẢI THƯỞNG */}
      <div className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Giải Thưởng & Chứng Nhận</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <AwardCard key={index} data={award} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* 8. CALL TO ACTION (CTA PREMIUM) */}
      <div className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400 opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <FaCompass className="text-6xl text-blue-200 mx-auto mb-6 opacity-80" />
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Sẵn Sàng Bắt Đầu Cuộc Phiêu Lưu?
              </h2>
              <p className="text-xl text-blue-100 mb-10 font-light">
                Hãy để ViVuGo đồng hành cùng bạn khám phá những điều tuyệt vời nhất mà thế giới
                mang lại. Kỷ niệm vô giá đang chờ bạn.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/tours"
                  className="bg-white text-blue-700 font-bold py-4 px-10 rounded-2xl hover:bg-gray-50 transition-colors shadow-lg text-lg"
                >
                  Khám Phá Tour
                </Link>
                <Link
                  to="/contact"
                  className="bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold py-4 px-10 rounded-2xl hover:bg-white/20 transition-all text-lg"
                >
                  Liên Hệ Ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

