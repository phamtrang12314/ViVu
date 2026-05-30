import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaBolt, FaCompass, FaTag } from 'react-icons/fa'
import { tourApi } from '../../apis/tour'
import type { Tour } from '../../types/tour'
import TourCard from '../TourCard'
import Button from '../Button'
import SectionHeader from './SectionHeader'
import AnimateSection from './AnimateSection'

type Variant = 'featured' | 'trending' | 'deals'

type Props = {
  variant: Variant
  queryKey: string
  queryFn: () => Promise<{ data: Tour[] }>
  badge: ReactNode
  title: string
  subtitle: string
  viewAllTo?: string
  layout?: 'grid' | 'featured-split'
}

const FEATURE_ROTATE_MS = 5000

function FeaturedSplitGrid({ tours }: { tours: Tour[] }) {
  const [featuredIndex, setFeaturedIndex] = useState(0)

  useEffect(() => {
    if (tours.length <= 1) return
    const timer = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % tours.length)
    }, FEATURE_ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [tours.length])

  useEffect(() => {
    if (featuredIndex >= tours.length) setFeaturedIndex(0)
  }, [featuredIndex, tours.length])

  const featuredTour = tours[featuredIndex]
  const sideTours = useMemo(() => tours.filter((_, index) => index !== featuredIndex).slice(0, 4), [tours, featuredIndex])

  if (!featuredTour) return null

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="lg:row-span-2">
        <TourCard key={featuredTour.tourID} tour={featuredTour} variant="featured" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {sideTours.map((tour) => (
          <TourCard key={tour.tourID} tour={tour} variant="default" />
        ))}
      </div>
    </div>
  )
}

function TourGrid({ tours, variant }: { tours: Tour[]; variant: Variant }) {
  if (variant === 'featured' && tours.length > 0) {
    return <FeaturedSplitGrid tours={tours} />
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tours.map((tour) => (
        <TourCard
          key={tour.tourID}
          tour={tour}
          variant={variant === 'trending' ? 'trending' : variant === 'deals' ? 'deal' : 'default'}
        />
      ))}
    </div>
  )
}

export default function TourShowcaseSection({
  variant,
  queryKey,
  queryFn,
  badge,
  title,
  subtitle,
  viewAllTo = '/tours',
  layout = 'grid'
}: Props) {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn
  })

  const tours = data?.data || []

  return (
    <AnimateSection className="bg-[#f8fafc] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={badge}
          title={title}
          subtitle={subtitle}
          action={
            <Link to={viewAllTo} className="group hidden items-center gap-2 font-semibold text-blue-600 hover:text-blue-800 md:inline-flex">
              Xem tất cả <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
          </div>
        ) : tours.length === 0 ? (
          <p className="py-12 text-center text-gray-500">Chưa có tour phù hợp.</p>
        ) : layout === 'featured-split' && variant === 'featured' ? (
          <TourGrid tours={tours} variant="featured" />
        ) : (
          <TourGrid tours={tours} variant={variant} />
        )}

        <div className="mt-10 text-center md:hidden">
          <Button as="link" to={viewAllTo} variant="outline" className="!rounded-xl">
            Xem tất cả
          </Button>
        </div>
      </div>
    </AnimateSection>
  )
}

export function FeaturedToursSection() {
  return (
    <TourShowcaseSection
      variant="featured"
      queryKey="featuredTours"
      queryFn={() => tourApi.getFeaturedTours().then((response) => ({ data: response.data.content }))}
      layout="featured-split"
      badge={
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-blue-600">
          <FaCompass /> Nổi bật
        </span>
      }
      title="Tour Nổi Bật"
      subtitle="Các hành trình được yêu thích với lịch trình rõ ràng, giá minh bạch và trải nghiệm ổn định."
    />
  )
}

export function TrendingToursSection() {
  return (
    <TourShowcaseSection
      variant="trending"
      queryKey="trendingTours"
      queryFn={() => tourApi.getTrendingTours(8).then((response) => ({ data: response.data }))}
      badge={
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-amber-600">
          <FaBolt /> Xu hướng
        </span>
      }
      title="Tour Trending"
      subtitle="Những tour đang được đặt nhiều nhất trong tuần."
      viewAllTo="/tours?sort=ranking,asc"
    />
  )
}

export function BestDealsSection() {
  return (
    <TourShowcaseSection
      variant="deals"
      queryKey="dealTours"
      queryFn={() => tourApi.getDealTours(8).then((response) => ({ data: response.data }))}
      badge={
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-red-600">
          <FaTag /> Hot deal
        </span>
      }
      title="Ưu đãi hấp dẫn"
      subtitle="Tổng hợp tour giảm giá theo thời điểm, số chỗ giới hạn."
      viewAllTo="/tours?deals_only=true"
    />
  )
}
