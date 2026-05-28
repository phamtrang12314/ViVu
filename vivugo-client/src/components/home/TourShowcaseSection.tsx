import type { ReactNode } from 'react'
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

function TourGrid({ tours, variant }: { tours: Tour[]; variant: Variant }) {
  if (variant === 'featured' && tours.length > 0) {
    const [hero, ...rest] = tours
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:row-span-2">
          <TourCard tour={hero} variant="featured" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {rest.slice(0, 4).map((tour) => (
            <TourCard key={tour.tourID} tour={tour} variant="default" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    <AnimateSection className="py-16 md:py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={badge}
          title={title}
          subtitle={subtitle}
          action={
            <Link
              to={viewAllTo}
              className="hidden md:inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 group"
            >
              Xem tất cả <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          }
        />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-600 rounded-full" />
          </div>
        ) : tours.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Chưa có tour phù hợp.</p>
        ) : layout === 'featured-split' && variant === 'featured' ? (
          <TourGrid tours={tours} variant="featured" />
        ) : (
          <TourGrid tours={tours} variant={variant} />
        )}

        <div className="text-center mt-10 md:hidden">
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
      queryFn={() => tourApi.getFeaturedTours().then((r) => ({ data: r.data.content }))}
      layout="featured-split"
      badge={
        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm bg-blue-100 px-4 py-1.5 rounded-full mb-4 inline-flex items-center gap-2">
          <FaCompass /> Nổi bật
        </span>
      }
      title="Tour Du Lịch Nổi Bật"
      subtitle="Hành trình được yêu thích nhất với chất lượng dịch vụ hàng đầu."
    />
  )
}

export function TrendingToursSection() {
  return (
    <TourShowcaseSection
      variant="trending"
      queryKey="trendingTours"
      queryFn={() => tourApi.getTrendingTours(8).then((r) => ({ data: r.data }))}
      badge={
        <span className="text-amber-600 font-bold tracking-wider uppercase text-sm bg-amber-100 px-4 py-1.5 rounded-full mb-4 inline-flex items-center gap-2">
          <FaBolt /> Xu hướng
        </span>
      }
      title="Trending Tours"
      subtitle="Các tour đang được đặt nhiều nhất tuần này."
      viewAllTo="/tours?sort=ranking,asc"
    />
  )
}

export function BestDealsSection() {
  return (
    <TourShowcaseSection
      variant="deals"
      queryKey="dealTours"
      queryFn={() => tourApi.getDealTours(8).then((r) => ({ data: r.data }))}
      badge={
        <span className="text-red-600 font-bold tracking-wider uppercase text-sm bg-red-100 px-4 py-1.5 rounded-full mb-4 inline-flex items-center gap-2">
          <FaTag /> Ưu đãi
        </span>
      }
      title="Best Deals"
      subtitle="Giảm giá sốc — đặt ngay trước khi hết chỗ."
      viewAllTo="/tours?deals_only=true"
    />
  )
}
