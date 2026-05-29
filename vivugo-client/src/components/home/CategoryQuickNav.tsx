import { Link } from 'react-router-dom'
import {
  FaUmbrellaBeach,
  FaMountain,
  FaLandmark,
  FaHiking,
  FaUtensils,
  FaGem
} from 'react-icons/fa'
import AnimateSection from './AnimateSection'

const categories = [
  { id: 'beach', label: 'Biển', icon: FaUmbrellaBeach, search: 'biển', color: 'from-cyan-500 to-blue-600' },
  { id: 'mountain', label: 'Núi', icon: FaMountain, search: 'núi', color: 'from-emerald-500 to-teal-600' },
  { id: 'culture', label: 'Văn hóa', icon: FaLandmark, search: 'văn hóa', color: 'from-amber-500 to-orange-600' },
  { id: 'adventure', label: 'Mạo hiểm', icon: FaHiking, search: 'mạo hiểm', color: 'from-orange-500 to-red-600' },
  { id: 'food', label: 'Ẩm thực', icon: FaUtensils, search: 'ẩm thực', color: 'from-rose-500 to-pink-600' },
  { id: 'luxury', label: 'Luxury', icon: FaGem, search: 'luxury', color: 'from-violet-500 to-purple-700' }
]

export default function CategoryQuickNav() {
  return (
    <AnimateSection className="relative z-30 -mt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/tours?search=${encodeURIComponent(cat.search)}`}
              className="group flex flex-col items-center gap-2 p-4 md:p-5 bg-white rounded-[var(--vivugo-radius)] shadow-[var(--vivugo-shadow)] border border-gray-100 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-all duration-300"
            >
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
              >
                <cat.icon size={22} />
              </div>
              <span className="text-xs md:text-sm font-bold text-gray-800">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </AnimateSection>
  )
}
