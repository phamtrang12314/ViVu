import type { TourDetails } from '../types/tour'

type TourImageLike = { url?: string | null }

type TourLike = {
  title?: string
  imageURL?: string | null
  destinationName?: string | null
  tourTypeName?: string | null
  destinations?: { nameDes?: string | null }[]
  tourImages?: TourImageLike[] | null
}

const FALLBACK_IMAGE_POOL = [
  '/hero.jpg',
  '/blog-01.avif',
  '/blog-02.jpg',
  '/blog-03.avif',
  '/dulichmaohiem.avif',
  '/khamphaamthuc.avif'
]

const SEA_IMAGES = ['/hero.jpg', '/blog-03.avif', '/blog-02.jpg']
const MOUNTAIN_IMAGES = ['/dulichmaohiem.avif', '/blog-01.avif', '/hero.jpg']
const CITY_IMAGES = ['/blog-02.jpg', '/blog-01.avif', '/khamphaamthuc.avif']

const hashText = (value: string) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const rotatePool = (pool: string[], seed: number) => {
  if (pool.length === 0) return []
  const offset = seed % pool.length
  return [...pool.slice(offset), ...pool.slice(0, offset)]
}

const chooseContextPool = (context: string, seed: number) => {
  const lower = context.toLowerCase()
  if (/(biển|vịnh|đảo|phú quốc|hạ long|nha trang|vũng tàu|cát bà)/.test(lower)) {
    return rotatePool(SEA_IMAGES, seed)
  }
  if (/(núi|sapa|fansipan|mộc châu|mai châu|ninh bình|hà giang|yên tử)/.test(lower)) {
    return rotatePool(MOUNTAIN_IMAGES, seed)
  }
  return rotatePool(CITY_IMAGES, seed)
}

const normalizeImagePath = (value?: string | null) => {
  if (!value) return null
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

export const buildTourImageSet = (tour: TourLike, minimum = 3) => {
  const primaryDestination = tour.destinationName || tour.destinations?.[0]?.nameDes || ''
  const seedSource = `${tour.title || ''}-${primaryDestination}-${tour.tourTypeName || ''}`
  const seed = hashText(seedSource || 'vivugo')
  const contextPool = chooseContextPool(`${tour.title || ''} ${primaryDestination}`, seed)
  const fallbackPool = rotatePool([...contextPool, ...FALLBACK_IMAGE_POOL], seed)

  const sourceImages = [
    normalizeImagePath(tour.imageURL),
    ...(tour.tourImages || []).map((item) => normalizeImagePath(item.url))
  ].filter((item): item is string => Boolean(item))

  const uniqueImages = Array.from(new Set(sourceImages))
  for (const fallbackImage of fallbackPool) {
    if (uniqueImages.length >= minimum) break
    if (!uniqueImages.includes(fallbackImage)) {
      uniqueImages.push(fallbackImage)
    }
  }

  return uniqueImages
}

export const buildTourDetailImageSet = (tour?: TourDetails) => {
  if (!tour) return []
  const images = buildTourImageSet(
    {
      title: tour.title,
      imageURL: tour.imageURL,
      destinationName: tour.destinations?.[0]?.nameDes,
      tourImages: tour.tourImages
    },
    5
  )

  return images.map((url, index) => ({
    url,
    caption: index === 0 ? tour.title : `Khung cảnh ${index + 1}`
  }))
}
