import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa'
import { destinationApi } from '../../apis/destination'
import type { Destination } from '../../types/destination'
import SectionHeader from './SectionHeader'
import AnimateSection from './AnimateSection'
import { resolveAssetUrl } from '../../utils/utils'

function MasonryItem({
  destination,
  className = ''
}: {
  destination: Destination
  className?: string
}) {
  return (
    <Link
      to={`/tours?destination_id=${destination.destinationID}`}
      className={`group relative block overflow-hidden rounded-[var(--vivugo-radius)] shadow-[var(--vivugo-shadow)] ${className}`}
    >
      <img
        src={resolveAssetUrl(destination.imageURLs?.[0], 'https://placehold.co/600x400?text=Destination')}
        alt={destination.nameDes}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute right-4 top-4 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
        {destination.tourCount} tour
      </div>
      <div className="absolute bottom-0 left-0 w-full p-5 text-white">
        <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-blue-300">
          <FaMapMarkerAlt size={12} />
          {destination.region || 'Việt Nam'}
        </div>
        <h3 className="text-xl font-extrabold md:text-2xl">{destination.nameDes}</h3>
      </div>
      <div className="absolute bottom-5 right-5 rounded-full border border-white/30 bg-white/20 p-2.5 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
        <FaArrowRight />
      </div>
    </Link>
  )
}

export default function DestinationsMasonry() {
  const { data, isLoading } = useQuery({
    queryKey: ['popularDestinations'],
    queryFn: destinationApi.getPopularDestinations
  })

  const destinations = (data?.data || []).slice(0, 7)
  const layoutClasses = ['masonry-featured', '', 'masonry-tall', '', '', 'masonry-tall', '']

  return (
    <AnimateSection className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={
            <span className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-orange-500">
              Top Destination
            </span>
          }
          title="Top Điểm Đến"
          subtitle="Khám phá các điểm đến nổi bật để lên lịch trình cho chuyến đi tiếp theo."
          action={
            <Link to="/destinations" className="hidden items-center gap-2 font-semibold text-blue-600 hover:text-blue-800 md:inline-flex">
              Tất cả điểm đến <FaArrowRight />
            </Link>
          }
        />

        {isLoading ? (
          <div className="py-16 text-center text-gray-500">Đang tải...</div>
        ) : (
          <div className="destinations-masonry">
            {destinations.map((destination, index) => (
              <MasonryItem
                key={destination.destinationID}
                destination={destination}
                className={layoutClasses[index] || ''}
              />
            ))}
          </div>
        )}
      </div>
    </AnimateSection>
  )
}
