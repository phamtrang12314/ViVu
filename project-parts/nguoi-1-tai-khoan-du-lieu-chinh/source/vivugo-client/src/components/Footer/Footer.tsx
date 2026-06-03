import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaHeadset
} from 'react-icons/fa'
import logo from '../../assets/logo.png'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Tất cả Tours', href: '#' },
    { name: 'Điểm đến hot', href: '#' },
    { name: 'Hướng dẫn đặt tour', href: '#' },
    { name: 'Cẩm nang du lịch', href: '#' },
    { name: 'Khuyến mãi', href: '#' }
  ]

  const supportLinks = [
    { name: 'Liên hệ', href: '#' },
    { name: 'Câu hỏi thường gặp', href: '#' },
    { name: 'Điều khoản dịch vụ', href: '#' },
    { name: 'Chính sách bảo mật', href: '#' },
    { name: 'Chính sách hoàn tiền', href: '/refund-policy' }
  ]

  return (
    <footer className="bg-[#0a0f1c] text-white pt-20 pb-8 relative overflow-hidden">
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-gray-800/60 pb-16">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img src={logo} alt="ViVuGo" className="w-24 drop-shadow-lg" />
            </div>
            <p className="text-blue-700 font-bold text-sm tracking-wider">
              TRAVEL • DISCOVER • EXPERIENCE
            </p>
            <p className="text-gray-400 leading-relaxed text-sm">
              Hành trình của bạn, đam mê của chúng tôi. ViVuGo cam kết mang đến những trải nghiệm
              du lịch tuyệt vời, an toàn và đáng nhớ nhất tại Việt Nam.
            </p>
            <div className="flex space-x-3 pt-2">
              {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-1 transition-all duration-300 text-gray-300 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-100 tracking-wide uppercase text-sm">
              Khám Phá
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-blue-400 transition duration-300 flex items-center gap-2 text-sm group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-100 tracking-wide uppercase text-sm">
              Khách Hàng
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-blue-400 transition duration-300 flex items-center gap-2 text-sm group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-100 tracking-wide uppercase text-sm">
              Liên Hệ
            </h3>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-start gap-3 group">
                <FaMapMarkerAlt
                  className="text-blue-500 mt-1 flex-shrink-0 group-hover:text-blue-400 transition-colors"
                  size={16}
                />
                <p className="leading-relaxed">
                  123 Đường Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP.HCM
                </p>
              </div>
              <div className="flex items-center gap-3 group">
                <FaPhoneAlt
                  className="text-blue-500 flex-shrink-0 group-hover:text-blue-400 transition-colors"
                  size={16}
                />
                <p>+84 989 471 415</p>
              </div>
              <div className="flex items-center gap-3 group">
                <FaEnvelope
                  className="text-blue-500 flex-shrink-0 group-hover:text-blue-400 transition-colors"
                  size={16}
                />
                <p>support@ViVuGo.com</p>
              </div>
              <div className="flex items-center gap-3 group">
                <FaHeadset
                  className="text-blue-500 flex-shrink-0 group-hover:text-blue-400 transition-colors"
                  size={16}
                />
                <p>Hỗ trợ trực tuyến 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-sm text-gray-500">
          <p>&copy; {currentYear} ViVuGo. Bản quyền thuộc về sinh viên IUH.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="hidden sm:inline-block">Thanh toán an toàn:</span>
            <div className="flex gap-2">
              {['VISA', 'MASTER', 'MOMO'].map((method) => (
                <div
                  key={method}
                  className="bg-white/10 px-3 py-1.5 rounded border border-white/5 backdrop-blur-sm"
                >
                  <span className="text-gray-300 font-bold text-xs tracking-wider">{method}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

