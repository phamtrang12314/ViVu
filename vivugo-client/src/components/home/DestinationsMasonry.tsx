import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { destinationApi } from '../../apis/destination'
import type { Destination } from '../../types/destination'
import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa'
import SectionHeader from './SectionHeader'
import AnimateSection from './AnimateSection'

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
      className={`relative block overflow-hidden rounded-[var(--vivugo-radius)] group shadow-[var(--vivugo-shadow)] ${className}`}
    >
      <img
        src={destination.imageURLs?.[0] || 'https://placehold.co/600x400?text=Destination'}
        alt={destination.nameDes}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full">
        {destination.tourCount} tours
      </div>
      <div className="absolute bottom-0 left-0 w-full p-5 text-white">
        <div className="flex items-center gap-1.5 text-blue-300 text-xs font-medium mb-1">
          <FaMapMarkerAlt size={12} />
          {destination.region || 'Việt Nam'}
        </div>
        <h3 className="text-xl md:text-2xl font-extrabold">{destination.nameDes}</h3>
      </div>
      <div className="absolute bottom-5 right-5 p-2.5 rounded-full bg-white/20 backdrop-blur border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
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
    <AnimateSection className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={
            <span className="text-orange-500 font-bold tracking-wider uppercase text-sm bg-orange-100 px-4 py-1.5 rounded-full mb-4 inline-block">
              Điểm Đến Hot
            </span>
          }
          title="Top Destinations"
          subtitle="Khám phá Việt Nam theo phong cách Pinterest — chọn vùng đất tiếp theo."
          action={
            <Link
              to="/destinations"
              className="hidden md:inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800"
            >
              Tất cả điểm đến <FaArrowRight />
            </Link>
          }
        />

        {isLoading ? (
          <div className="text-center text-gray-500 py-16">Đang tải...</div>
        ) : (
          <div className="destinations-masonry">
            {destinations.map((dest, i) => (
              <MasonryItem
                key={dest.destinationID}
                destination={dest}
                className={layoutClasses[i] || ''}
              />
            ))}
          </div>
        )}
      </div>
    </AnimateSection>
  )
}
