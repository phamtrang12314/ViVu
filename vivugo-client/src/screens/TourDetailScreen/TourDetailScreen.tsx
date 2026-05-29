import { useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Calendar,
  Camera,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Hotel,
  MapPin,
  Plane,
  ShieldCheck,
  Utensils,
  Users,
  X
} from 'lucide-react'
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa'
import { tourApi } from '../../apis/tour'
import type { Tour, TourDetails } from '../../types/tour'
import { formatCurrency, resolveAssetUrl } from '../../utils/utils'
import TourBookingSection from '../../components/TourBookingSection'
import TourCard from '../../components/TourCard'
import TourReviewSection from '../../components/TourReviewSection'

function RelatedToursSection({
  tourTypeId,
  currentTourId
}: {
  tourTypeId: string
  currentTourId: string
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['relatedTours', tourTypeId],
    queryFn: () => tourApi.getTours({ tour_type_id: tourTypeId, size: 4, page: 0 }),
    enabled: !!tourTypeId
  })

  const relatedTours = data?.data.content.filter((tour: Tour) => tour.tourID !== currentTourId).slice(0, 3) || []

  if (isLoading) {
    return <div className="py-10 text-center font-semibold text-slate-500">Đang tải tour liên quan...</div>
  }

  if (relatedTours.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900">Tour liên quan</h2>
        <Link to="/tours" className="text-sm font-bold text-blue-600 hover:text-blue-800">
          Xem thêm
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {relatedTours.map((tour: Tour) => (
          <TourCard key={tour.tourID} tour={tour} />
        ))}
      </div>
    </section>
  )
}

const resolveImage = (url?: string) => {
  if (!url) return 'https://placehold.co/1200x800/E2E8F0/334155?text=VivuGo'
  return resolveAssetUrl(url)
}

const formatDate = (date?: string) => {
  if (!date) return 'Đang cập nhật'
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

export default function TourDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showDetailedItinerary, setShowDetailedItinerary] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['tourDetails', id],
    queryFn: () => (id ? tourApi.getTourDetails(id) : Promise.reject(new Error('Missing tour id'))),
    enabled: !!id
  })

  const tour: TourDetails | undefined = data?.data

  const images = useMemo(() => {
    if (!tour) return []
    const gallery = [
      { url: tour.imageURL, caption: tour.title },
      ...(tour.tourImages || []).map((image) => ({
        url: image.url,
        caption: image.caption || tour.title
      }))
    ].filter((image) => Boolean(image.url))

    return gallery.length > 0 ? gallery : [{ url: '', caption: tour.title }]
  }, [tour])

  const activeImage = images[activeImageIndex] || images[0]
  const destinations = tour?.destinations || []

  const timelineItems = useMemo(() => {
    if (!tour) return []

    const orderedItineraries = [...(tour.itineraries || [])].sort((a, b) => a.dayNumber - b.dayNumber)
    const primaryDestination = tour.destinations?.[0]?.nameDes || 'điểm đến'
    const departurePlace = tour.departurePlace || 'điểm hẹn'
    const targetCount = Math.min(5, Math.max(3, (tour.durationDays || 1) + 2))

    const detailedFallbacks = [
      {
        title: `Khởi hành từ ${departurePlace}`,
        description: `Tập trung tại ${departurePlace}, kiểm tra hành lý và bắt đầu hành trình đến ${primaryDestination}.`,
        details: [
          `Đi đâu: ${departurePlace} - ${primaryDestination}`,
          'Ăn gì: Ăn nhẹ hoặc bữa chính theo khung giờ khởi hành',
          'Làm gì: Check-in đoàn, nghe phổ biến lịch trình, di chuyển đến điểm tham quan đầu tiên',
          'Ở đâu: Khách sạn hoặc điểm lưu trú theo hạng tour'
        ]
      },
      {
        title: `Khám phá ${primaryDestination}`,
        description: 'Tham quan các điểm nổi bật, chụp ảnh và nghe hướng dẫn viên kể câu chuyện địa phương.',
        details: [
          `Đi đâu: Khu tham quan chính tại ${primaryDestination}`,
          'Ăn gì: Đặc sản địa phương được sắp xếp theo chương trình',
          'Làm gì: Tham quan, chụp ảnh, trải nghiệm văn hóa bản địa',
          'Ở đâu: Nghỉ đêm tại khách sạn hoặc homestay phù hợp'
        ]
      },
      {
        title: 'Ẩm thực và trải nghiệm địa phương',
        description: 'Dành thời gian thưởng thức món ngon, ghé chợ hoặc khu phố đặc trưng của điểm đến.',
        details: [
          `Đi đâu: Khu ẩm thực hoặc chợ địa phương tại ${primaryDestination}`,
          'Ăn gì: Bữa trưa/bữa tối với món đặc sản vùng miền',
          'Làm gì: Tự do mua sắm, trò chuyện cùng người bản địa, thử món nổi tiếng',
          'Ở đâu: Quay về nơi lưu trú để nghỉ ngơi'
        ]
      },
      {
        title: 'Hoạt động trải nghiệm',
        description: 'Tham gia hoạt động đặc trưng như trekking nhẹ, chèo thuyền, workshop hoặc city tour.',
        details: [
          `Đi đâu: Tuyến trải nghiệm phù hợp tại ${primaryDestination}`,
          'Ăn gì: Bữa ăn theo chương trình, có thời gian nghỉ giữa chặng',
          'Làm gì: Hoạt động ngoài trời, check-in, tham gia trải nghiệm theo nhóm',
          'Ở đâu: Lưu trú tại khách sạn hoặc di chuyển về điểm nghỉ'
        ]
      },
      {
        title: 'Tự do khám phá và mua sắm',
        description: 'Có khoảng thời gian tự do để du khách chọn quán cà phê, điểm check-in hoặc mua quà.',
        details: [
          `Đi đâu: Trung tâm ${primaryDestination} hoặc khu mua sắm gần nơi lưu trú`,
          'Ăn gì: Gợi ý quán ăn/cà phê địa phương theo sở thích',
          'Làm gì: Tự do khám phá, mua đặc sản, chụp ảnh lưu niệm',
          'Ở đâu: Nghỉ ngơi trước chặng di chuyển tiếp theo'
        ]
      },
      {
        title: 'Tổng kết hành trình',
        description: 'Trả phòng, ghé điểm tham quan cuối và di chuyển về điểm hẹn ban đầu.',
        details: [
          `Đi đâu: ${primaryDestination} - ${departurePlace}`,
          'Ăn gì: Bữa cuối theo chương trình hoặc tự túc theo khung giờ',
          'Làm gì: Trả phòng, mua quà, tổng kết chuyến đi cùng hướng dẫn viên',
          `Ở đâu: Kết thúc tại ${departurePlace}`
        ]
      },
      {
        title: 'Phương án linh hoạt',
        description: 'Điều chỉnh lịch theo thời tiết, sức khỏe đoàn hoặc các điểm tham quan đang mở cửa.',
        details: [
          `Đi đâu: Điểm thay thế nổi bật tại ${primaryDestination}`,
          'Ăn gì: Nhà hàng địa phương được chọn theo lịch thực tế',
          'Làm gì: Bổ sung trải nghiệm, nghỉ ngơi hoặc đổi tuyến tham quan',
          'Ở đâu: Theo phương án lưu trú/di chuyển được xác nhận'
        ]
      }
    ]

    const items = orderedItineraries.map((item, index) => {
      const destination = tour.destinations?.[index % Math.max(tour.destinations.length, 1)]?.nameDes || primaryDestination

      return {
        dayNumber: item.dayNumber || index + 1,
        title: item.title?.replace(/^Ngày\s*\d+\s*:?\s*/i, '') || `Khám phá ${destination}`,
        description: item.description || `Khám phá ${destination} theo lịch trình đã chọn.`,
        details: [
          `Đi đâu: ${destination}`,
          'Ăn gì: Bữa chính theo chương trình, ưu tiên đặc sản địa phương',
          `Làm gì: ${item.title || 'Tham quan, check-in và trải nghiệm theo nhóm'}`,
          'Ở đâu: Theo khách sạn hoặc điểm nghỉ đã xác nhận'
        ]
      }
    })

    let nextDayNumber = items.length > 0 ? Math.max(...items.map((item) => item.dayNumber)) + 1 : 1
    detailedFallbacks.forEach((fallback) => {
      if (items.length >= targetCount) return
      items.push({ ...fallback, dayNumber: nextDayNumber })
      nextDayNumber += 1
    })

    return items.slice(0, 5)
  }, [tour])

  const visibleTimelineItems = timelineItems
  const itineraryDetailIcons = [MapPin, Utensils, Camera, Hotel]

  const changeImage = (direction: 'next' | 'prev') => {
    if (images.length <= 1) return
    setActiveImageIndex((current) => {
      if (direction === 'next') return current === images.length - 1 ? 0 : current + 1
      return current === 0 ? images.length - 1 : current - 1
    })
  }

  const changeLightboxImage = (direction: 'next' | 'prev', event: MouseEvent) => {
    event.stopPropagation()
    if (images.length <= 1) return
    setLightboxIndex((current) => {
      const index = current ?? 0
      if (direction === 'next') return index === images.length - 1 ? 0 : index + 1
      return index === 0 ? images.length - 1 : index - 1
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 pt-24">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 pt-24">
        <div className="rounded-[28px] bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Không tìm thấy tour</h1>
          <Link to="/tours" className="mt-4 inline-flex font-bold text-blue-600">
            Quay lại danh sách tour
          </Link>
        </div>
      </div>
    )
  }

  const destinationText = destinations.map((item) => item.nameDes).join(' • ') || 'Đang cập nhật'
  const rating = tour.averageRating || 5
  const reviewCount = tour.reviewCount || 0

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative min-h-[680px] overflow-hidden pt-24">
        <img
          src={resolveImage(activeImage?.url)}
          alt={activeImage?.caption || tour.title}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.src = 'https://placehold.co/1200x800/E2E8F0/334155?text=Tour'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/72 via-black/40 to-slate-950" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-14 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="flex min-h-[520px] flex-col justify-end text-white">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/30 bg-white/16 px-4 py-2 text-sm font-bold backdrop-blur-xl">
                {tour.tourType?.nameType || 'Tour'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/16 px-4 py-2 text-sm font-bold backdrop-blur-xl">
                <FaStar className="text-amber-300" />
                {rating.toFixed(1)} ({reviewCount} đánh giá)
              </span>
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">{tour.title}</h1>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-white/84">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 backdrop-blur-xl">
                <MapPin size={16} />
                {destinationText}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 backdrop-blur-xl">
                <Clock size={16} />
                {tour.durationDays} ngày {tour.durationNights} đêm
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 backdrop-blur-xl">
                <Calendar size={16} />
                {formatDate(tour.startDate)}
              </span>
            </div>

            <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`h-28 overflow-hidden rounded-2xl border backdrop-blur-xl transition ${
                    activeImageIndex === index ? 'border-white bg-white/24' : 'border-white/30 bg-white/10'
                  }`}
                >
                  <img src={resolveImage(image.url)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <aside className="self-end rounded-[28px] border border-white/30 bg-white/18 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
            <div className="rounded-[22px] border border-white/40 bg-white/22 p-5 backdrop-blur-xl">
              <p className="text-sm font-semibold text-white/70">Giá chỉ từ</p>
              <div className="mt-1 text-3xl font-black">
                {formatCurrency(tour.finalPriceAdult || tour.priceAdult)}
              </div>
              <p className="mt-2 text-sm text-white/72">Khởi hành từ {tour.departurePlace || 'điểm hẹn trung tâm'}</p>
              <button
                type="button"
                onClick={() => document.getElementById('booking-panel')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-5 w-full rounded-2xl border border-white/70 bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-4 text-lg font-black uppercase tracking-wide text-white shadow-[0_18px_38px_rgba(249,115,22,0.38)] transition hover:-translate-y-1 hover:scale-[1.02] hover:from-orange-600 hover:to-rose-600 hover:shadow-[0_24px_48px_rgba(249,115,22,0.52)]"
              >
                Đặt tour
              </button>
            </div>
          </aside>

          {images.length > 1 && (
            <div className="absolute bottom-5 right-6 z-20 hidden gap-2 lg:flex">
              <button
                type="button"
                onClick={() => changeImage('prev')}
                className="rounded-full border border-white/35 bg-white/18 p-3 text-white backdrop-blur-xl transition hover:bg-white/28"
                aria-label="Ảnh trước"
              >
                <FaChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => changeImage('next')}
                className="rounded-full border border-white/35 bg-white/18 p-3 text-white backdrop-blur-xl transition hover:bg-white/28"
                aria-label="Ảnh kế tiếp"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: Calendar, label: 'Khởi hành', value: formatDate(tour.startDate) },
              { icon: Clock, label: 'Thời gian', value: `${tour.durationDays}N${tour.durationNights}Đ` },
              { icon: Users, label: 'Số chỗ', value: `${tour.maxParticipants} khách` },
              { icon: MapPin, label: 'Nơi đi', value: tour.departurePlace || 'Đang cập nhật' }
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-white bg-white/76 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl"
              >
                <item.icon className="mb-4 text-blue-600" size={24} />
                <p className="text-xs font-bold uppercase text-slate-400">{item.label}</p>
                <p className="mt-1 font-black text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>

          <section className="rounded-[30px] bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/18" />
              <h2 className="text-center text-3xl font-black uppercase tracking-wide">Lịch trình tour</h2>
              <div className="h-px flex-1 bg-white/18" />
            </div>

            <div className="grid gap-8 lg:grid-cols-[0.82fr_1fr]">
              <div className="space-y-5 text-sm leading-7 text-white/72">
                <div
                  className="prose prose-invert max-w-none prose-p:text-white/72"
                  dangerouslySetInnerHTML={{ __html: tour.description || 'Lịch trình đang được cập nhật.' }}
                />
                <div className="grid grid-cols-2 gap-3 pt-3">
                  {[
                    { icon: ShieldCheck, title: 'Hướng dẫn viên', text: 'Theo sát suốt hành trình' },
                    { icon: Plane, title: 'Di chuyển', text: 'Lịch trình tối ưu' },
                    { icon: Hotel, title: 'Lưu trú', text: 'Khách sạn phù hợp' },
                    { icon: CheckCircle2, title: 'Hỗ trợ', text: 'Xác nhận nhanh' }
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-white/18 bg-white/8 p-4 backdrop-blur-xl">
                      <item.icon className="mb-3 text-amber-300" size={20} />
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="mt-1 text-xs text-white/58">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="mb-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowDetailedItinerary((value) => !value)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/24 bg-white/10 px-4 py-2 text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:-translate-y-0.5 hover:bg-white/18"
                  >
                    {showDetailedItinerary ? 'Thu gọn lịch trình' : 'Xem chi tiết lịch trình'}
                    {showDetailedItinerary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
                <div className="absolute bottom-4 left-5 top-16 w-px bg-white/22 md:left-1/2" />
                <div className="space-y-7">
                  {visibleTimelineItems.length > 0 ? (
                    visibleTimelineItems.map((item, index) => {
                      const isLeft = index % 2 === 1

                      return (
                      <div
                        key={`${item.dayNumber}-${item.title}`}
                        className="relative grid grid-cols-[48px_1fr] gap-4 md:grid-cols-[1fr_48px_1fr] md:items-center"
                      >
                        <div
                          className={`relative z-10 col-start-1 row-start-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white shadow-lg md:col-start-2 md:mx-auto ${
                            isLeft ? 'md:row-start-1' : ''
                          }`}
                        >
                          <span className="h-3.5 w-3.5 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 shadow-[0_0_0_7px_rgba(255,255,255,0.14)]" />
                        </div>
                        <div
                          className={`col-start-2 row-start-1 rounded-[24px] border border-white/16 bg-white/8 p-5 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/12 ${
                            isLeft ? 'md:col-start-1' : 'md:col-start-3'
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <h3 className="text-lg font-black text-white">{item.title}</h3>
                            <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/62">
                              Hoạt động
                            </span>
                          </div>
                          <p className="text-sm leading-7 text-white/68">{item.description}</p>
                          {showDetailedItinerary && (
                            <div className="mt-4 grid gap-2">
                              {item.details.map((detail, detailIndex) => {
                                const DetailIcon = itineraryDetailIcons[detailIndex % itineraryDetailIcons.length]

                                return (
                                  <div
                                    key={detail}
                                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/7 px-3 py-2 text-xs font-semibold leading-5 text-white/72"
                                  >
                                    <DetailIcon className="mt-0.5 shrink-0 text-amber-300" size={15} />
                                    <span>{detail}</span>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      )
                    })
                  ) : (
                    <div className="rounded-[24px] border border-white/16 bg-white/8 p-6 text-white/70">
                      Lịch trình đang được cập nhật.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <TourReviewSection tourId={tour.tourID} />
        </div>

        <div id="booking-panel" className="lg:sticky lg:top-24 lg:self-start">
          <TourBookingSection tour={tour} />
        </div>
      </section>

      <RelatedToursSection tourTypeId={tour.tourType?.tourTypeID} currentTourId={tour.tourID} />

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/92 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white backdrop-blur-xl"
              aria-label="Đóng"
            >
              <X />
            </button>
            <button
              type="button"
              onClick={(event) => changeLightboxImage('prev', event)}
              className="absolute left-5 top-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-xl"
              aria-label="Ảnh trước"
            >
              <FaChevronLeft />
            </button>
            <img
              src={resolveImage(images[lightboxIndex]?.url)}
              alt={images[lightboxIndex]?.caption || tour.title}
              className="max-h-[86vh] max-w-full rounded-2xl object-contain"
              onClick={(event) => event.stopPropagation()}
            />
            <button
              type="button"
              onClick={(event) => changeLightboxImage('next', event)}
              className="absolute right-5 top-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-xl"
              aria-label="Ảnh kế tiếp"
            >
              <FaChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
