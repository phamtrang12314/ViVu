import { Link } from 'react-router-dom'
import AnimateSection from './AnimateSection'

type Category = {
  id: string
  label: string
  search: string
  emoji: string
}

const categories: Category[] = [
  { id: 'beach', label: 'Biển', search: 'biển', emoji: '🏖️' },
  { id: 'island', label: 'Đảo', search: 'đảo', emoji: '🏝️' },
  { id: 'rural', label: 'Miệt vườn', search: 'miệt vườn', emoji: '🌾' },
  { id: 'culture', label: 'Văn hóa', search: 'văn hóa', emoji: '🏛️' },
  { id: 'explore', label: 'Khám phá', search: 'khám phá', emoji: '🌍' }
]

export default function CategoryQuickNav() {
  return (
    <AnimateSection className="relative z-30 -mt-12 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-3 shadow-sm">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/tours?search=${encodeURIComponent(category.search)}`}
                className="group flex flex-col items-center gap-1.5 rounded-xl p-3 transition hover:bg-white/80"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-3xl shadow-sm transition group-hover:scale-105">
                  {category.emoji}
                </span>
                <span className="text-xs font-bold text-slate-700">{category.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AnimateSection>
  )
}
