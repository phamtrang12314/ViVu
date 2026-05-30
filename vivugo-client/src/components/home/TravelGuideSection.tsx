import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AnimateSection from './AnimateSection'
import { travelGuideArticles, travelGuideTopics, type TravelGuideTopic } from '../../data/travelGuideArticles'

export default function TravelGuideSection() {
  const [activeTopic, setActiveTopic] = useState<TravelGuideTopic>('Bài viết mới')

  const visibleArticles = useMemo(() => {
    if (activeTopic === 'Bài viết mới') {
      return travelGuideArticles.slice(0, 4)
    }
    return travelGuideArticles.filter((article) => article.topic === activeTopic).slice(0, 4)
  }, [activeTopic])

  return (
    <AnimateSection className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-4xl font-black text-slate-900 md:text-5xl">Cẩm nang du lịch</h2>
          <p className="mt-2 text-lg text-slate-600">Bí kíp du lịch từ A-Z, đi vui vẻ và tối ưu chi phí.</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-x-4 gap-y-2 border-b border-emerald-100 pb-3">
          {travelGuideTopics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setActiveTopic(topic)}
              className={`border-b-2 pb-2 text-lg font-bold transition-colors ${
                activeTopic === topic
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {visibleArticles.map((article) => (
            <Link
              key={article.slug}
              to={`/cam-nang/${article.slug}`}
              className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <img src={article.coverImage} alt={article.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="line-clamp-3 text-xl font-extrabold leading-snug text-slate-900">{article.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimateSection>
  )
}
