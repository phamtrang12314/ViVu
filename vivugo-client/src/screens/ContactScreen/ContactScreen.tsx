/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { contactApi, type ContactMessagePayload } from '../../apis/contact.api'

// Dữ liệu mẫu
const officeLocations = [
  {
    city: 'Văn phòng Chính - TP.HCM',
    address: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM',
    phone: '+84 28 1234 5678',
    email: 'info@ViVuGo.com',
    isMain: true
  },
  {
    city: 'Hà Nội',
    address: 'Tầng 3, Tòa nhà ABC, Hoàn Kiếm, Hà Nội',
    phone: '+84 24 9876 5432',
    email: 'hanoi@ViVuGo.com',
    isMain: false
  },
  {
    city: 'Đà Nẵng',
    address: 'Đường Võ Nguyên Giáp, Quận Sơn Trà, Đà Nẵng',
    phone: '+84 236 4567 8901',
    email: 'danang@ViVuGo.com',
    isMain: false
  },
  {
    city: 'Cần Thơ',
    address: '159 Trần Văn Khéo, Quận Ninh Kiều, Cần Thơ',
    phone: '+84 292 234 5678',
    email: 'cantho@ViVuGo.com',
    isMain: false
  }
]

const faqs = [
  {
    question: 'Làm thế nào để đặt tour?',
    answer:
      'Quý khách có thể đặt tour trực tiếp trên website, qua điện thoại hoặc đến văn phòng của chúng tôi. Đội ngũ tư vấn sẽ hỗ trợ bạn chọn tour phù hợp nhất.'
  },
  {
    question: 'Chính sách hủy tour như thế nào?',
    answer:
      'Chính sách hủy tour được linh hoạt: Hoàn tiền 100% nếu hủy trước 7 ngày, 50% nếu hủy trước 3 ngày, và 0% nếu hủy sau 3 ngày.'
  },
  {
    question: 'Tour có bao gồm bảo hiểm không?',
    answer:
      'Tất cả tour của chúng tôi đều bao gồm bảo hiểm du lịch cơ bản. Khách hàng có thể mua thêm bảo hiểm mở rộng nếu có nhu cầu.'
  },
  {
    question: 'Có thể tùy chỉnh lịch trình tour không?',
    answer:
      'Chúng tôi có các tour tùy chọn cho nhóm từ 6 người trở lên. Liên hệ với chúng tôi để được tư vấn chi tiết.'
  }
]

function GeneralContactInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20">
      <ContactInfoCard
        icon={FaMapMarkerAlt}
        title="Địa chỉ"
        detail="123 Đường Lê Lợi, Q1, TP.HCM"
        color="from-blue-500 to-cyan-500"
      />
      <ContactInfoCard
        icon={FaPhoneAlt}
        title="Điện thoại"
        detail="+84 989 471 415"
        color="from-purple-500 to-indigo-500"
      />
      <ContactInfoCard
        icon={FaEnvelope}
        title="Email"
        detail="info@ViVuGo.com"
        color="from-rose-500 to-red-500"
      />
      <ContactInfoCard
        icon={FaClock}
        title="Giờ làm việc"
        detail="T2-T7, 8:00 - 18:00"
        color="from-amber-400 to-orange-500"
      />
    </div>
  )
}

function ContactInfoCard({
  icon: Icon,
  title,
  detail,
  color
}: {
  icon: React.ElementType
  title: string
  detail: string
  color: string
}) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col items-center justify-center text-center transform hover:-translate-y-2 transition-all duration-300 border border-gray-50">
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}
      >
        <Icon className="text-white text-2xl" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 font-medium">{detail}</p>
    </div>
  )
}

function ContactFormAndOffices() {
  const [formData, setFormData] = useState<Omit<ContactMessagePayload, 'subject'>>({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [subject, setSubject] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mapEmbedSrc =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4679.932060222481!2d106.69700687572787!3d10.772434959265976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3f56a3de55%3A0x7c6107f1253d69c9!2zMTIzIEzDqiBM4bujaSwgUGjGsOG7nW5nIELhur9uIFRow6BuaCwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e1!3m2!1svi!2s!4v1762439308541!5m2!1svi!2s'

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    if (id === 'tourType') setSubject(value)
    else setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.phone || !formData.message || !subject) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc (*).')
      return
    }
    setIsSubmitting(true)
    try {
      await contactApi.submitMessage({ ...formData, subject })
      toast.success('Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.')
      setFormData({ name: '', email: '', phone: '', message: '' })
      setSubject('')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gửi tin nhắn thất bại. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form Gửi Tin Nhắn */}
        <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
          <div className="mb-8">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm bg-blue-50 px-4 py-1.5 rounded-full mb-4 inline-block">
              Hỗ trợ 24/7
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Gửi Tin Nhắn Cho Chúng Tôi
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800"
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Điện thoại *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800"
                  placeholder="0901 234 567"
                />
              </div>
              <div>
                <label
                  htmlFor="tourType"
                  className="block text-sm font-bold text-gray-700 mb-2 ml-1"
                >
                  Chủ đề *
                </label>
                <select
                  id="tourType"
                  required
                  value={subject}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800 cursor-pointer appearance-none"
                >
                  <option value="">-- Chọn chủ đề --</option>
                  <option value="Đăt tour">Đặt tour</option>
                  <option value="Hủy/Đổi tour">Hủy/Đổi tour</option>
                  <option value="Góp ý/Khiếu nại">Góp ý/Khiếu nại</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Tin nhắn của bạn *
              </label>
              <textarea
                id="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800 resize-none"
                placeholder="Hãy mô tả chi tiết yêu cầu của bạn..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70"
            >
              <FaPaperPlane /> {isSubmitting ? 'Đang gửi đi...' : 'Gửi tin nhắn'}
            </button>
          </form>
        </div>

        {/* Văn phòng & Bản đồ */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 h-[350px] relative overflow-hidden group">
            <iframe
              src={mapEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Chi nhánh khác</h2>
            <div className="space-y-6">
              {officeLocations
                .filter((loc) => !loc.isMain)
                .map((loc) => (
                  <div
                    key={loc.city}
                    className="flex gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-colors cursor-default"
                  >
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 text-blue-600">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{loc.city}</h3>
                      <p className="text-sm text-gray-500 mb-1">{loc.address}</p>
                      <p className="text-sm font-medium text-gray-700">{loc.phone}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FAQSection() {
  return (
    <div className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Câu Hỏi Thường Gặp</h2>
          <p className="text-lg text-gray-500">
            Giải đáp nhanh các thắc mắc của bạn về dịch vụ tại ViVuGo
          </p>
        </div>
        <div className="grid gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex gap-4 md:gap-6 group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                Q
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ContactScreen() {
  return (
    <div className="bg-white">
      {/* Banner */}
      <div className="relative min-h-[70vh] flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-out scale-105 duration-1000"
          style={{ backgroundImage: 'url(/hero.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-white" />

        <div className="relative z-10 text-center pb-12 mt-10">
          <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold tracking-wider uppercase mb-6 shadow-lg inline-block">
            Kết Nối Với ViVuGo
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-xl tracking-tight ">
            Chúng Tôi Luôn <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
              Lắng Nghe Bạn
            </span>
          </h1>
        </div>
      </div>

      <GeneralContactInfo />
      <ContactFormAndOffices />
      <FAQSection />
    </div>
  )
}

