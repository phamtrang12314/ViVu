import type { Review } from '../types/review.type'

const MOCK_NAMES = [
  'Trần Công Sơn',
  'Dương Thúy Hạnh',
  'Đặng Mai Phương',
  'Ngô Thanh Vân',
  'Bùi Bích Phương',
  'Phạm Quang Khải',
  'Lê Minh Thu',
  'Nguyễn Hoàng Nam',
  'Vũ Ngọc Anh',
  'Hoàng Gia Bảo',
  'Tạ Lan Hương',
  'Phan Đức Tuấn',
  'Trịnh Nhật Vy',
  'Đỗ Khánh Linh',
  'Lưu Tuấn Kiệt',
  'Mai Kim Ngân',
  'Đinh Hữu Thành',
  'Cao Minh Châu',
  'Trần Mạnh Tuấn',
  'Nguyễn Thảo Chi'
]

const MOCK_COMMENTS: Record<number, string[]> = {
  5: [
    'Tour rất chỉn chu, lịch trình hợp lý và hướng dẫn viên hỗ trợ tốt.',
    'Cảnh đẹp hơn mong đợi, dịch vụ ổn định từ đầu đến cuối.',
    'Gia đình đi cùng trẻ nhỏ vẫn rất thoải mái, sẽ quay lại lần sau.',
    'Khách sạn sạch, ăn uống tốt, thời gian di chuyển vừa phải.',
    'Điểm cộng lớn là đội ngũ điều phối rất nhiệt tình.'
  ],
  4: [
    'Tổng thể tốt, chỉ cần thêm thời gian tự do buổi tối là đẹp.',
    'Lịch trình ổn, một vài điểm tham quan hơi đông nhưng vẫn đáng đi.',
    'Giá hợp lý so với chất lượng, dịch vụ khá chuyên nghiệp.',
    'Tour ổn định, phù hợp nhóm bạn hoặc gia đình.',
    'Mọi thứ ổn, xe đưa đón đúng giờ và thoải mái.'
  ],
  3: [
    'Trải nghiệm tạm ổn, lịch trình hơi dày vào cuối ngày.',
    'View đẹp nhưng bữa trưa chưa hợp khẩu vị lắm.',
    'Điểm tham quan ổn, cần cải thiện thêm phần nghỉ giữa các chặng.',
    'Tổng thể được, phù hợp nếu muốn đi nhanh nhiều điểm.',
    'Không tệ, nhưng mong bên tour linh hoạt hơn ở một vài điểm dừng.'
  ]
}

const buildRatingSequence = () => [5, 4, 5, 3, 5, 4, 5, 3, 4, 5, 5, 4, 3, 5, 4, 5, 3, 4]

const hashText = (value: string) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const rotate = <T,>(items: T[], offset: number) => {
  if (items.length === 0) return items
  const normalizedOffset = offset % items.length
  return [...items.slice(normalizedOffset), ...items.slice(0, normalizedOffset)]
}

const AVATAR_BACKGROUNDS = ['2563eb', '0891b2', '7c3aed', 'db2777', 'ea580c', '0f766e']

const buildAvatarUrl = (name: string, seed: number) => {
  const bg = AVATAR_BACKGROUNDS[Math.abs(seed) % AVATAR_BACKGROUNDS.length]
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=128&bold=true`
}

export const buildSyntheticReviews = (tourId: string, imagePool: string[], minimum = 18): Review[] => {
  const seed = hashText(tourId || 'vivugo')
  const ratingSequence = rotate(buildRatingSequence(), seed)
  const names = rotate(MOCK_NAMES, seed)

  const result: Review[] = []
  for (let i = 0; i < minimum; i += 1) {
    const rating = ratingSequence[i % ratingSequence.length]
    const commentOptions = MOCK_COMMENTS[rating]
    const comment = commentOptions[(seed + i) % commentOptions.length]
    const name = names[i % names.length]
    const dayOffset = minimum - i
    const createdAt = new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000).toISOString()
    const photoUrls =
      imagePool.length > 0 && i % 2 === 0
        ? [imagePool[(seed + i) % imagePool.length], imagePool[(seed + i + 1) % imagePool.length]].filter(Boolean)
        : []

    result.push({
      id: `synthetic-${tourId}-${i + 1}`,
      rating,
      comment,
      createdAt,
      photoUrls,
      user: {
        name,
        avatarURL: buildAvatarUrl(name, seed + i)
      }
    })
  }

  return result
}

export const mergeReviewsWithSynthetic = (apiReviews: Review[], syntheticReviews: Review[], minimum = 18) => {
  const normalizedApi = apiReviews.map((review, index) => ({
    ...review,
    id: review.id || `api-review-${index + 1}`,
    photoUrls: review.photoUrls || []
  }))
  if (normalizedApi.length >= minimum) {
    return normalizedApi
  }
  const needed = minimum - normalizedApi.length
  return [...normalizedApi, ...syntheticReviews.slice(0, needed)]
}
