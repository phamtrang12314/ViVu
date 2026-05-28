import { Link } from 'react-router-dom'
import type { Destination } from '../../types/destination'
import { FaChevronRight, FaMapMarkerAlt } from 'react-icons/fa'
import { resolveAssetUrl } from '../../utils/utils'

export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      to={`/tours?destination_id=${destination.destinationID}`}
      className="relative block h-[400px] rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] group transform transition-all duration-500 hover:-translate-y-2"
    >
      {/* Ảnh Background */}
      <img
        src={resolveAssetUrl(destination.imageURLs?.[0], 'https://placehold.co/600x400?text=Destination')}
        alt={destination.nameDes}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Lớp phủ mờ (Gradient) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c]/90 via-[#0a0f1c]/20 to-transparent transition-opacity duration-300" />

      {/* Badge Kính mờ (Glassmorphism) */}
      <div className="absolute top-5 right-5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
        {destination.tourCount} Tours
      </div>

      {/* Nội dung text */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-white transform transition-transform duration-500 group-hover:-translate-y-2">
        <div className="flex items-center gap-2 mb-2 opacity-80">
          <FaMapMarkerAlt size={14} className="text-blue-400" />
          <span className="text-sm font-medium uppercase tracking-wider">Việt Nam</span>
        </div>
        <h3 className="text-3xl font-extrabold mb-1 drop-shadow-md">{destination.nameDes}</h3>
        <p className="text-gray-200 text-sm font-medium line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          Khám phá vùng đất tuyệt vời này
        </p>
      </div>

      {/* Nút mũi tên xuất hiện khi hover */}
      <div className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 shadow-xl">
        <FaChevronRight size={18} />
      </div>
    </Link>
  )
}

