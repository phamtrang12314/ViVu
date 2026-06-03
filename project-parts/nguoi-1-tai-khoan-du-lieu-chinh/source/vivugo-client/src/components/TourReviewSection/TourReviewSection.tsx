import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { FaStar } from 'react-icons/fa'
import Button from '../Button'
import ReviewCard from '../ReviewCard'
import { reviewApi } from '../../apis/review.api'
import type { Review } from '../../types/review.type'
import { buildSyntheticReviews, mergeReviewsWithSynthetic } from '../../utils/mockReviews'

const PAGE_SIZE = 5
const MIN_REVIEWS = 18

interface Props {
  tourId: string
  galleryImages?: string[]
}

const computeDistribution = (reviews: Review[]) => {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((review) => {
    const rating = Math.min(5, Math.max(1, Math.round(review.rating))) as 1 | 2 | 3 | 4 | 5
    counts[rating] += 1
  })
  const total = reviews.length || 1
  return {
    counts,
    total,
    average:
      reviews.reduce((sum, review) => sum + Math.min(5, Math.max(1, review.rating)), 0) /
      (reviews.length || 1)
  }
}

export default function TourReviewSection({ tourId, galleryImages = [] }: Props) {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useQuery({
    queryKey: ['reviews', tourId],
    queryFn: () => reviewApi.getReviewsForTour(tourId, { page: 0, size: 50 }),
    placeholderData: keepPreviousData
  })

  const mergedReviews = useMemo(() => {
    const apiReviews = data?.data.content || []
    const syntheticReviews = buildSyntheticReviews(tourId, galleryImages, MIN_REVIEWS)
    return mergeReviewsWithSynthetic(apiReviews, syntheticReviews, MIN_REVIEWS)
  }, [data?.data.content, tourId, galleryImages])

  const totalPages = Math.max(1, Math.ceil(mergedReviews.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const start = safePage * PAGE_SIZE
  const visibleReviews = mergedReviews.slice(start, start + PAGE_SIZE)
  const distribution = computeDistribution(mergedReviews)

  if (isLoading && mergedReviews.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900">Đánh giá từ khách hàng</h2>
        <p className="mt-4 text-slate-500">Đang tải đánh giá...</p>
      </div>
    )
  }

  return (
    <section id="reviews-section" className="space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-black text-slate-900">Đánh giá từ khách hàng</h2>

      <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 md:grid-cols-[220px_1fr_240px]">
        <div className="flex flex-col items-center justify-center border-b border-slate-200 p-6 md:border-b-0 md:border-r">
          <p className="text-6xl font-black leading-none text-orange-500">{distribution.average.toFixed(1)}</p>
          <div className="mt-2 text-3xl text-orange-500">
            <FaStar />
          </div>
          <p className="mt-3 text-center text-sm font-bold text-slate-700">ĐÁNH GIÁ TRUNG BÌNH</p>
        </div>
        <div className="space-y-2 border-b border-slate-200 p-6 md:border-b-0 md:border-r">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution.counts[star as 1 | 2 | 3 | 4 | 5]
            const percent = Math.round((count / distribution.total) * 100)
            return (
              <div key={star} className="grid grid-cols-[30px_1fr_90px] items-center gap-3 text-sm">
                <span className="font-bold text-slate-800">{star}★</span>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${percent}%` }} />
                </div>
                <span className="font-semibold text-emerald-600">
                  {percent}% | {count} đánh giá
                </span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-center p-6">
          <Button className="w-full !rounded-xl !bg-emerald-600 !py-3 !font-black !text-white hover:!bg-emerald-700">
            Đánh giá ngay
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {visibleReviews.map((review, index) => (
          <ReviewCard key={review.id || `review-${safePage}-${index}`} review={review} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={safePage === 0}
            className="!rounded-lg !px-3 !py-2"
          >
            ←
          </Button>
          {Array.from({ length: totalPages }, (_, index) => index).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                pageNumber === safePage ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pageNumber + 1}
            </button>
          ))}
          <Button
            variant="outline"
            onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
            disabled={safePage >= totalPages - 1}
            className="!rounded-lg !px-3 !py-2"
          >
            →
          </Button>
        </div>
      )}
    </section>
  )
}
