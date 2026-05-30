import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, ChevronRight, MapPin } from 'lucide-react'
import { tourApi } from '../../apis/tour'
import { formatCurrency, resolveAssetUrl } from '../../utils/utils'
import {
  travelGuideArticleMap,
  travelGuideArticles,
  type TravelGuideBlock
} from '../../data/travelGuideArticles'

const renderBlock = (block: TravelGuideBlock, index: number) => {
  if (block.type === 'heading') {
    return (
      <h2 key={`heading-${index}`} className="mt-8 text-3xl font-black text-slate-900">
        {block.text}
      </h2>
    )
  }

  if (block.type === 'paragraph') {
    return (
      <p key={`paragraph-${index}`} className="mt-4 text-lg leading-8 text-slate-700">
        {block.text}
      </p>
    )
  }

  if (block.type === 'list') {
    return (
      <ul key={`list-${index}`} className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8 text-slate-700">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }

  return (
    <figure key={`image-${index}`} className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <img src={block.src} alt={block.alt} className="w-full object-cover" />
      {block.caption && <figcaption className="px-4 py-3 text-center text-base italic text-slate-500">{block.caption}</figcaption>}
    </figure>
  )
}

export default function TravelGuideArticleScreen() {
  const { slug } = useParams()
  const article = slug ? travelGuideArticleMap.get(slug) : undefined

  const shouldLoadRelatedTours = article?.relation.kind === 'destination'
  const destinationKeyword = article?.relation.kind === 'destination' ? article.relation.keyword : ''

  const { data: relatedToursData } = useQuery({
    queryKey: ['guide-related-tours', slug, destinationKeyword],
    queryFn: () =>
      tourApi.getTours({
        page: 0,
        size: 3,
        sort: 'ranking,asc',
        search: destinationKeyword
      }),
    enabled: shouldLoadRelatedTours
  })

  const relatedTours = relatedToursData?.data.content || []

  const otherArticles = useMemo(
    () => travelGuideArticles.filter((item) => item.slug !== slug).slice(0, 3),
    [slug]
  )

  if (!article) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="bg-slate-50 pt-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
            {article.breadcrumbs.map((crumb, index) => (
              <span key={crumb} className="inline-flex items-center gap-2">
                {index > 0 && <ChevronRight size={14} />}
                {crumb}
              </span>
            ))}
          </nav>

          <h1 className="text-4xl font-black leading-tight text-slate-900 md:text-6xl">{article.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-base text-slate-500">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} />
              {article.publishedAt}
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-bold text-emerald-700">{article.topic}</span>
          </div>

          <figure className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <img src={article.coverImage} alt={article.title} className="w-full object-cover" />
          </figure>

          <div className="mt-6 border-t border-slate-100 pt-2">{article.blocks.map((block, index) => renderBlock(block, index))}</div>
        </article>

        <aside className="space-y-6">
          {article.relation.kind === 'destination' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-2xl font-black text-slate-900">{article.relation.ctaTitle}</h3>
              {relatedTours.length === 0 ? (
                <p className="text-sm text-slate-500">Đang cập nhật tour liên quan.</p>
              ) : (
                <div className="space-y-4">
                  {relatedTours.map((tour) => (
                    <Link key={tour.tourID} to={`/tours/${tour.tourID}`} className="block overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 transition hover:shadow-md">
                      <img src={resolveAssetUrl(tour.imageURL, '/hero.jpg')} alt={tour.title} className="h-32 w-full rounded-xl object-cover" />
                      <div className="p-2">
                        <p className="line-clamp-2 text-sm font-bold text-slate-900">{tour.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{tour.destinationName || 'Đang cập nhật'}</p>
                        <p className="mt-2 text-lg font-black text-blue-600">{formatCurrency(tour.finalPrice || tour.priceAdult || 0)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {article.relation.kind === 'trending' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900">{article.relation.ctaTitle}</h3>
              <p className="mt-2 text-base text-slate-600">Xem ngay danh sách tour đang được quan tâm nhiều và có ưu đãi tốt.</p>
              <Link
                to="/tours?sort=ranking,asc"
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-lg font-bold text-white transition hover:bg-blue-700"
              >
                Xem tour hot
              </Link>
            </div>
          )}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-2xl font-black text-slate-900">Bài viết đề xuất</h3>
            <div className="mt-4 space-y-4">
              {otherArticles.map((item) => (
                <Link key={item.slug} to={`/cam-nang/${item.slug}`} className="group flex gap-3 rounded-2xl border border-slate-100 p-2 hover:bg-slate-50">
                  <img src={item.coverImage} alt={item.title} className="h-20 w-24 rounded-xl object-cover" />
                  <div>
                    <p className="line-clamp-2 font-bold text-slate-800 group-hover:text-blue-600">{item.title}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                      <MapPin size={12} />
                      {item.topic}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
