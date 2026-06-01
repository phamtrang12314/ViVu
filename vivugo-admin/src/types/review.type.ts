export interface ReviewUser {
  name: string
  avatarURL: string | null
}

export interface Review {
  rating: number
  comment: string
  videoUrl?: string | null
  createdAt: string
  user: ReviewUser
}

export interface ReviewApiResponse {
  content: Review[]
  totalPages: number
  totalElements: number
  number: number
  first: boolean
  last: boolean
}
