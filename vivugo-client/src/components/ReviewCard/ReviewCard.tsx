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

interface Props {
  review: Review
}

export default function ReviewCard({ review }: Props) {
  const avatar = review.user.avatarURL || buildFallbackAvatar(review.user.name)
  const photos = review.photoUrls || []

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
