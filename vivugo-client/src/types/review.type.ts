export interface ReviewUser {
  name: string
  avatarURL: string | null
}

export interface Review {
  id?: string
  rating: number
  comment: string
  createdAt: string
  photoUrls?: string[]
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
