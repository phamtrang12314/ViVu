import { useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import {
  FaBus,
  FaCalendarAlt,
  FaCamera,
  FaChevronRight,
  FaClock,
  FaHeadset,
  FaHeart,
  FaHotel,
  FaMapMarkerAlt,
  FaMoon,
  FaPlaneDeparture,
  FaRoute,
  FaShieldAlt,
  FaStar,
  FaSun,
  FaUtensils
} from 'react-icons/fa'
import type { IconType } from 'react-icons'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { tourApi } from '../../apis/tour'
import TourBookingSection from '../../components/TourBookingSection'
import TourReviewSection from '../../components/TourReviewSection'
import TourCard from '../../components/TourCard'
import { buildTourDetailImageSet } from '../../utils/tourVisuals'
import { formatCurrency, resolveAssetUrl } from '../../utils/utils'
import { getVivugoSessionId } from '../../utils/aiSession'
import type { TourDetails } from '../../types/tour'
import { AppContext } from '../../contexts/app.context'
import { favoriteApi } from '../../apis/favorite.api'

type TabKey = 'itinerary' | 'policy' | 'reviews'

const CHINH_SACH_BAO_GOM = [
  'Xe đưa đón theo chương trình.',
  'Khách sạn tiêu chuẩn theo hạng tour.',
  'Bữa ăn theo lịch trình (số lượng bữa tùy tour).',
  'Vé tham quan các điểm có trong chương trình.',
  'Hướng dẫn viên theo suốt tuyến.'
]

const CHINH_SACH_KHONG_BAO_GOM = [
  'Chi phí cá nhân ngoài chương trình.',
  'Đồ uống trong bữa ăn và chi tiêu tự túc.',
  'Phụ thu phòng đơn (nếu có).',
  'Thuế VAT theo quy định.'
]

const tachMoTa = (value?: string) => {
  if (!value) return []
  return value
    .split(/\r?\n|[.]/g)
    .map((item) => item.trim())
    .filter(Boolean)
}

const taoDiemNhanh = (title: string, itineraryCount: number) => {
  const list = tachMoTa(title)
  if (list.length >= 3) return list.slice(0, 3)
  if (itineraryCount <= 0) return ['Lịch trình đang được cập nhật chi tiết.']
  return ['Di chuyển theo lịch trình tối ưu.', 'Kết hợp tham quan, trải nghiệm và nghỉ ngơi.', 'Hỗ trợ xuyên suốt trong thời gian đi tour.']
}

const dinhDangNgay = (value?: string) => {
  if (!value) return 'Đang cập nhật'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('vi-VN').format(date)
}

const layHanhTrinh = (tour?: TourDetails) => {
  if (!tour?.destinations?.length) return 'Đang cập nhật'
  return tour.destinations.map((item) => item.nameDes).join(' - ')
}

type DiemLichTrinh = {
  time: string
  label: string
  note: string
  icon: IconType
}

const taoDiemLichTrinh = (dayIndex: number): DiemLichTrinh[] => {
  const templates: DiemLichTrinh[][] = [
    [
      { time: '06:00', label: 'Đón khách', note: 'Tại điểm hẹn', icon: FaBus },
      { time: '08:30', label: 'Di chuyển', note: 'Theo cao tốc', icon: FaRoute },
      { time: '11:30', label: 'Tham quan', note: 'Điểm nổi bật', icon: FaCamera },
      { time: '12:30', label: 'Ăn trưa', note: 'Nhà hàng địa phương', icon: FaUtensils },
      { time: '18:00', label: 'Nhận phòng', note: 'Nghỉ ngơi', icon: FaHotel },
      { time: '19:30', label: 'Tự do', note: 'Khám phá buổi tối', icon: FaMoon }
    ],
    [
      { time: '07:00', label: 'Ăn sáng', note: 'Tại khách sạn', icon: FaSun },
      { time: '08:30', label: 'Điểm đến', note: 'Check-in tham quan', icon: FaCamera },
      { time: '11:30', label: 'Ăn trưa', note: 'Món đặc sản', icon: FaUtensils },
      { time: '14:00', label: 'Hoạt động', note: 'Trải nghiệm nổi bật', icon: FaRoute },
      { time: '17:00', label: 'Nghỉ ngơi', note: 'Khách sạn / resort', icon: FaHotel },
      { time: '19:00', label: 'Tự do', note: 'Khám phá đêm', icon: FaMoon }
    ]
  ]
  return templates[dayIndex % templates.length]
}

const theTienIchLichTrinh = [
  { title: 'Hướng dẫn viên', subtitle: 'Theo sát suốt hành trình', icon: FaShieldAlt },
  { title: 'Di chuyển', subtitle: 'Lịch trình tối ưu', icon: FaRoute },
  { title: 'Lưu trú', subtitle: 'Khách sạn phù hợp', icon: FaHotel },
  { title: 'Hỗ trợ', subtitle: 'Xác nhận nhanh', icon: FaHeadset }
]

const getYouTubeEmbedUrl = (url: URL) => {
  const host = url.hostname.toLowerCase()

  if (host === 'youtu.be') {
    const id = url.pathname.split('/').filter(Boolean)[0]
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }

  if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
    if (url.pathname === '/watch') {
      const id = url.searchParams.get('v')
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }

    const segments = url.pathname.split('/').filter(Boolean)
    if (segments[0] === 'shorts' || segments[0] === 'embed') {
      const id = segments[1]
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
  }

  return null
}

const getTikTokEmbedUrl = (url: URL) => {
  const host = url.hostname.toLowerCase()
  if (host !== 'tiktok.com' && !host.endsWith('.tiktok.com')) return null

  const segments = url.pathname.split('/').filter(Boolean)
  const videoIndex = segments.findIndex((segment) => segment === 'video')
  const videoId = videoIndex >= 0 ? segments[videoIndex + 1] : null
  if (!videoId) return null

  return `https://www.tiktok.com/embed/v2/${videoId}`
}

const extractExtension = (url: string) => {
  const clean = url.split('?')[0].split('#')[0]
  const lastDot = clean.lastIndexOf('.')
  if (lastDot < 0) return ''
  return clean.slice(lastDot + 1).toLowerCase()
}

const isDirectVideoUrl = (url?: string | null) =>
  !!url && ['mp4', 'webm', 'mov', 'm4v'].includes(extractExtension(url))

const getEmbedVideoUrl = (videoUrl?: string | null) => {
  if (!videoUrl) return null

  try {
    const parsed = new URL(videoUrl)
    return getYouTubeEmbedUrl(parsed) || getTikTokEmbedUrl(parsed)
  } catch {
    return null
  }
}

export default function TourDetailScreen() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { isAuthenticated, favoriteIds, addFavoriteId, removeFavoriteId } = useContext(AppContext)

  const [activeTab, setActiveTab] = useState<TabKey>('itinerary')
  const [activeHeroImageIndex, setActiveHeroImageIndex] = useState(0)
  const [activeGalleryImageIndex, setActiveGalleryImageIndex] = useState(0)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tour-detail', id],
    queryFn: () => tourApi.getTourDetails(id as string),
    enabled: Boolean(id)
  })

  const { data: suggestedToursData } = useQuery({
    queryKey: ['tour-suggested', id],
    queryFn: () => tourApi.getTrendingTours(8)
  })

  const { data: personalizedToursData } = useQuery({
    queryKey: ['tour-personalized', id],
    queryFn: () => tourApi.getPersonalizedRecommendations(getVivugoSessionId(), 8),
    enabled: Boolean(id)
  })

  const addFavoriteMutation = useMutation({ mutationFn: favoriteApi.addFavorite })
  const removeFavoriteMutation = useMutation({ mutationFn: favoriteApi.removeFavorite })

  const tour = data?.data
  const tourReviewVideoUrl = tour?.reviewVideoUrl || null
  const tourReviewEmbedUrl = getEmbedVideoUrl(tourReviewVideoUrl)

  useEffect(() => {
    if (!tour?.tourID) return
    tourApi.trackTourView(tour.tourID, getVivugoSessionId()).catch(() => undefined)
  }, [tour?.tourID])

  const detailImages = useMemo(() => buildTourDetailImageSet(tour), [tour])
  const heroImage = detailImages[activeHeroImageIndex] || detailImages[0]
  const galleryImage = detailImages[activeGalleryImageIndex] || detailImages[0]
  const diemNhanh = useMemo(
    () => taoDiemNhanh(tour?.description || tour?.title || '', tour?.itineraries?.length || 0),
    [tour?.description, tour?.title, tour?.itineraries?.length]
  )

  const tourGoiY = useMemo(() => {
    const personalizedTours = personalizedToursData?.data?.tours || []
    if (personalizedTours.length > 0) {
      return personalizedTours.filter((item) => item.tourID !== id).slice(0, 4)
    }
    if (!suggestedToursData?.data) return []
    return suggestedToursData.data.filter((item) => item.tourID !== id).slice(0, 4)
  }, [personalizedToursData?.data?.tours, suggestedToursData?.data, id])

  const isLiked = tour ? favoriteIds.has(tour.tourID) : false
  const isFavoriteProcessing = addFavoriteMutation.isPending || removeFavoriteMutation.isPending

  const xuLyYeuThich = () => {
    if (!tour) return
    if (!isAuthenticated) {
      toast.info('Bạn cần đăng nhập để thực hiện chức năng này')
      return
    }

    if (isLiked) {
      removeFavoriteMutation.mutate(tour.tourID, {
        onSuccess: () => {
          removeFavoriteId(tour.tourID)
          queryClient.invalidateQueries({ queryKey: ['favoriteIds'] })
          toast.success('Đã xóa khỏi danh sách yêu thích!')
        },
        onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại.')
      })
      return
    }

    addFavoriteMutation.mutate(
      { tourId: tour.tourID },
      {
        onSuccess: () => {
          addFavoriteId(tour.tourID)
          queryClient.invalidateQueries({ queryKey: ['favoriteIds'] })
          toast.success('Đã thêm tour vào danh sách yêu thích!')
        },
        onError: (error: AxiosError | Error) => {
          const axiosError = error as AxiosError<{ message: string }>
          if (axiosError.response?.status === 409) {
            addFavoriteId(tour.tourID)
            toast.info('Bạn đã yêu thích tour này rồi.')
            return
          }
          toast.error('Có lỗi xảy ra, vui lòng thử lại sau.')
        }
      }
    )
  }

  const cuonDenDatTour = () => {
    const bookingElement = document.getElementById('booking-panel')
    if (!bookingElement) return
    bookingElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28">
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-5">
            <div className="h-[540px] rounded-none bg-slate-200" />
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="h-[460px] rounded-3xl bg-slate-200" />
              <div className="h-[460px] rounded-3xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !tour) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Không tải được thông tin tour</h2>
          <p className="mt-3 text-slate-600">Vui lòng thử lại sau hoặc quay về danh sách tour.</p>
          <Link
            to="/tours"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-bold text-white hover:bg-blue-700"
          >
            Quay lại danh sách <FaChevronRight />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 min-h-screen">
        <img
          src={resolveAssetUrl(heroImage?.url, '/hero.jpg')}
          alt={heroImage?.caption || tour.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/48 to-black/35" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-slate-100/30 to-slate-50" />
        <div className="relative mx-auto flex min-h-screen max-w-[1360px] items-center px-6 pb-14 pt-[104px] sm:px-8 lg:px-10">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-5 text-sm font-semibold text-white/85">
                <Link to="/tours" className="hover:text-white">
                  Tours
                </Link>
                <span className="ml-2 text-white">{tour.title}</span>
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/45 bg-white/10 px-4 py-1.5 text-sm font-bold text-white">
                  {tour.tourType?.nameType || 'Tour'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/10 px-4 py-1.5 text-sm font-bold text-white">
                  <FaStar className="text-amber-300" />
                  {(tour.averageRating || 4.7).toFixed(1)} ({tour.reviewCount || 0} đánh giá)
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight text-white md:text-7xl">{tour.title}</h1>

              <div className="mt-6 flex flex-wrap gap-3 text-base font-semibold text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                  <FaMapMarkerAlt />
                  {layHanhTrinh(tour)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                  <FaClock />
                  {tour.durationDays} ngày {tour.durationNights} đêm
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                  <FaCalendarAlt />
                  {dinhDangNgay(tour.startDate)}
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {detailImages.slice(0, 4).map((image, index) => (
                  <button
                    key={`${image.url}-hero-${index}`}
                    type="button"
                    onClick={() => setActiveHeroImageIndex(index)}
                    className={`h-24 w-36 overflow-hidden rounded-2xl border-2 transition ${
                      index === activeHeroImageIndex ? 'border-white' : 'border-transparent hover:border-white/60'
                    }`}
                  >
                    <img src={resolveAssetUrl(image.url, '/hero.jpg')} alt={image.caption} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="self-center rounded-[30px] border border-white/40 bg-white/15 p-4 backdrop-blur-xl">
              <div className="rounded-[24px] border border-white/35 bg-black/15 p-5">
                <p className="text-lg font-semibold text-white/85">Giá chỉ từ</p>
                <p className="mt-1 text-5xl font-black text-white">{formatCurrency(tour.finalPriceAdult || tour.priceAdult || 0)}</p>
                <p className="mt-2 text-base text-white/85">Khởi hành từ {tour.departurePlace || 'Đang cập nhật'}</p>
                <button
                  type="button"
                  onClick={cuonDenDatTour}
                  className="mt-5 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 py-3 text-xl font-black uppercase text-white transition hover:brightness-110"
                >
                  Đặt tour
                </button>
                <button
                  type="button"
                  onClick={xuLyYeuThich}
                  disabled={isFavoriteProcessing}
                  className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-bold transition ${
                    isLiked
                      ? 'border-rose-300 bg-rose-500/20 text-white'
                      : 'border-white/40 bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <FaHeart className={isLiked ? 'text-rose-300' : 'text-white'} />
                  {isLiked ? 'Đã yêu thích tour' : 'Yêu thích tour'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <section className="mb-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-1 lg:grid-cols-[2fr_1fr]">
              <div className="relative h-[430px]">
                <img
                  src={resolveAssetUrl(galleryImage?.url, '/hero.jpg')}
                  alt={galleryImage?.caption || tour.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-rows-2 gap-1">
                {detailImages.slice(1, 3).map((image, index) => (
                  <button
                    key={`${image.url}-side-${index}`}
                    type="button"
                    onClick={() => setActiveGalleryImageIndex(index + 1)}
                    className="group relative h-[214px] overflow-hidden"
                  >
                    <img
                      src={resolveAssetUrl(image.url, '/hero.jpg')}
                      alt={image.caption}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/30" />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 border-t border-slate-100 p-4">
              {detailImages.map((image, index) => (
                <button
                  type="button"
                  key={`${image.url}-gallery-thumb-${index}`}
                  onClick={() => setActiveGalleryImageIndex(index)}
                  className={`h-20 w-28 overflow-hidden rounded-xl border-2 transition ${
                    index === activeGalleryImageIndex ? 'border-blue-600' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img src={resolveAssetUrl(image.url, '/hero.jpg')} alt={image.caption} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <TourBookingSection tour={tour} />
        </section>

        <section className="mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <FaMapMarkerAlt className="text-blue-600" />
            Hành trình: {layHanhTrinh(tour)}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <FaClock className="text-blue-600" />
            {tour.durationDays} ngày {tour.durationNights} đêm
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <FaPlaneDeparture className="text-blue-600" />
            Khởi hành: {tour.departurePlace || 'Đang cập nhật'}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <FaCalendarAlt className="text-blue-600" />
            Ngày đi: {dinhDangNgay(tour.startDate)}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
            <button
              type="button"
              onClick={() => setActiveTab('itinerary')}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                activeTab === 'itinerary' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Lịch trình
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('policy')}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                activeTab === 'policy' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Chính sách giá
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                activeTab === 'reviews' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Đánh giá
            </button>
          </div>

          {activeTab === 'itinerary' && (
            <div className="rounded-[28px] border border-[#1b2d5b] bg-[radial-gradient(circle_at_top,_#0f1f4d_0%,_#030b2a_48%,_#02071d_100%)] p-5 text-white md:p-6">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/15 pb-5">
                <div>
                  <h3 className="text-4xl font-black tracking-wide">LỊCH TRÌNH TOUR</h3>
                  <p className="mt-3 max-w-2xl text-white/80">{diemNhanh.join(' ')}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-bold text-white transition hover:bg-white/20"
                >
                  Xem chi tiết lịch trình
                </button>
              </div>

              <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {theTienIchLichTrinh.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                    >
                      <Icon className="mb-3 text-2xl text-amber-300" />
                      <h4 className="text-2xl font-bold">{feature.title}</h4>
                      <p className="mt-1 text-white/70">{feature.subtitle}</p>
                    </div>
                  )
                })}
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  <h4 className="text-3xl font-black leading-tight">{tour.itineraries?.[0]?.title || 'Hoạt động nổi bật'}</h4>
                  <p className="mt-2 text-white/75 line-clamp-3">{tour.itineraries?.[0]?.description || 'Đang cập nhật'}</p>
                </div>
              </div>

              <div className="space-y-5">
                {(tour.itineraries || []).map((itinerary, index) => {
                  const dayImage = detailImages[(index + 1) % detailImages.length]?.url
                  const timelineStops = taoDiemLichTrinh(index)
                  return (
                    <article
                      key={`${itinerary.dayNumber}-${index}`}
                      className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] md:p-5"
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h4 className="flex flex-wrap items-center gap-3 text-2xl font-bold">
                          <span className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-black">NGÀY {itinerary.dayNumber}</span>
                          <span>{itinerary.title}</span>
                        </h4>
                        <button
                          type="button"
                          className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold text-white"
                        >
                          Ẩn chi tiết
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                        {timelineStops.map((stop, stopIndex) => {
                          const StopIcon = stop.icon
                          return (
                            <div key={`${stop.time}-${stopIndex}`} className="relative">
                              <div className="mb-2 text-lg font-black text-amber-300">{stop.time}</div>
                              <div className="flex items-center gap-2">
                                <StopIcon className="text-xl text-amber-300" />
                                <div className="h-px flex-1 bg-white/20" />
                              </div>
                              <p className="mt-2 text-lg font-bold">{stop.label}</p>
                              <p className="text-sm text-white/70">{stop.note}</p>
                            </div>
                          )
                        })}
                      </div>

                      <div className="mt-4 grid gap-4 border-t border-white/15 pt-4 lg:grid-cols-[1fr_260px]">
                        <div className="space-y-2 text-base leading-8 text-white/90">
                          {tachMoTa(itinerary.description).length > 0 ? (
                            tachMoTa(itinerary.description).slice(0, 6).map((line, lineIndex) => <p key={`${line}-${lineIndex}`}>{line}</p>)
                          ) : (
                            <p>Chi tiết lịch trình đang được cập nhật.</p>
                          )}
                        </div>
                        <div className="overflow-hidden rounded-xl border border-white/20">
                          <img src={resolveAssetUrl(dayImage, '/hero.jpg')} alt={`Ngày ${itinerary.dayNumber}`} className="h-full min-h-[180px] w-full object-cover" />
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              {tourReviewVideoUrl && (
                <div className="mt-8 rounded-2xl border border-white/20 bg-white/[0.03] p-4 md:p-5">
                  <h4 className="mb-3 text-2xl font-bold text-white">Video Review Tour</h4>
                  {isDirectVideoUrl(tourReviewVideoUrl) ? (
                    <video controls preload="metadata" className="w-full rounded-xl bg-black">
                      <source src={resolveAssetUrl(tourReviewVideoUrl, tourReviewVideoUrl)} />
                    </video>
                  ) : tourReviewEmbedUrl ? (
                    <div className="relative w-full overflow-hidden rounded-xl pt-[56.25%]">
                      <iframe
                        src={tourReviewEmbedUrl}
                        title={`Video review tour ${tour.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                        className="absolute left-0 top-0 h-full w-full"
                      />
                    </div>
                  ) : (
                    <a
                      href={tourReviewVideoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex text-sm font-semibold text-amber-300 hover:text-amber-200"
                    >
                      Xem video review tour
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="space-y-5">
              <h3 className="text-2xl font-black text-slate-900">Bao gồm / Không bao gồm</h3>
              <div className="rounded-2xl border border-slate-200 p-4 md:p-5">
                <h4 className="text-lg font-bold text-slate-900">Giá tour bao gồm</h4>
                <ul className="mt-3 space-y-2 text-slate-700">
                  {CHINH_SACH_BAO_GOM.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 md:p-5">
                <h4 className="text-lg font-bold text-slate-900">Giá tour không bao gồm</h4>
                <ul className="mt-3 space-y-2 text-slate-700">
                  {CHINH_SACH_KHONG_BAO_GOM.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && <TourReviewSection tourId={tour.tourID} galleryImages={detailImages.map((item) => item.url)} />}
        </section>

        {tourGoiY.length > 0 && (
          <section className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900">Có thể bạn cũng thích</h3>
              <Link to="/tours" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                Xem tất cả tour
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {tourGoiY.map((item) => (
                <TourCard key={item.tourID} tour={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
