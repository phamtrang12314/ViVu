import { FaCheckCircle, FaStar } from 'react-icons/fa'
import type { Review } from '../../types/review.type'
import { resolveAssetUrl } from '../../utils/utils'

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }, (_, index) => (
      <FaStar key={index} className={index < rating ? 'text-amber-500' : 'text-slate-200'} />
    ))}
  </div>
)

const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString))

const buildFallbackAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff&size=128&bold=true`

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

const getEmbedVideoUrl = (videoUrl?: string | null) => {
  if (!videoUrl) return null

  try {
    const parsed = new URL(videoUrl)
    return getYouTubeEmbedUrl(parsed) || getTikTokEmbedUrl(parsed)
  } catch {
    return null
  }
}

const extractExtension = (url: string) => {
  const clean = url.split('?')[0].split('#')[0]
  const lastDot = clean.lastIndexOf('.')
  if (lastDot < 0) return ''
  return clean.slice(lastDot + 1).toLowerCase()
}

const isDirectImageUrl = (url?: string | null) =>
  !!url && ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'].includes(extractExtension(url))

const isDirectVideoUrl = (url?: string | null) =>
  !!url && ['mp4', 'webm', 'mov', 'm4v'].includes(extractExtension(url))

interface Props {
  review: Review
}

export default function ReviewCard({ review }: Props) {
  const avatar = review.user.avatarURL || buildFallbackAvatar(review.user.name)
  const photos = review.photoUrls || []
  const embedVideoUrl = getEmbedVideoUrl(review.videoUrl)
  const mediaUrl = review.videoUrl || null

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-start gap-4">
        <img
          src={resolveAssetUrl(avatar, buildFallbackAvatar(review.user.name))}
          alt={review.user.name}
          onError={(event) => {
            event.currentTarget.src = buildFallbackAvatar(review.user.name)
          }}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-lg font-bold text-slate-900">{review.user.name}</h4>
              <p className="text-sm text-slate-500">{formatDate(review.createdAt)}</p>
            </div>
            <div className="flex items-center gap-3">
              <StarRating rating={review.rating} />
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                <FaCheckCircle />
                Khách đã đi tour
              </span>
            </div>
          </div>
          <p className="mt-3 text-base leading-7 text-slate-700">{review.comment}</p>
          {review.adminReply && (
            <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
              <p className="font-semibold">ViVuGo</p>
              <p className="mt-1 whitespace-pre-wrap">{review.adminReply}</p>
            </div>
          )}
          {mediaUrl && isDirectImageUrl(mediaUrl) && (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <img
                src={resolveAssetUrl(mediaUrl, '/hero.jpg')}
                alt="Ảnh review từ khách hàng"
                className="h-full max-h-[420px] w-full object-cover"
              />
            </div>
          )}
          {mediaUrl && isDirectVideoUrl(mediaUrl) && (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <video
                controls
                preload="metadata"
                className="h-full max-h-[420px] w-full bg-black"
              >
                <source src={resolveAssetUrl(mediaUrl, mediaUrl)} />
              </video>
            </div>
          )}
          {!isDirectImageUrl(mediaUrl) && !isDirectVideoUrl(mediaUrl) && embedVideoUrl && (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  src={embedVideoUrl}
                  title={`Video review - ${review.user.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="absolute left-0 top-0 h-full w-full"
                />
              </div>
            </div>
          )}
          {!isDirectImageUrl(mediaUrl) &&
            !isDirectVideoUrl(mediaUrl) &&
            !embedVideoUrl &&
            review.videoUrl && (
            <a
              href={review.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Xem media review
            </a>
            )}
          {photos.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {photos.slice(0, 3).map((photoUrl, index) => (
                <div key={`${photoUrl}-${index}`} className="overflow-hidden rounded-xl border border-slate-100">
                  <img
                    src={resolveAssetUrl(photoUrl, '/hero.jpg')}
                    alt="Ảnh trải nghiệm tour"
                    className="h-24 w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
