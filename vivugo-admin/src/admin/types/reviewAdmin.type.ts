export type ReviewStatus = "PENDING" | "APPROVED" | "HIDDEN"

export interface ReviewAdmin {
  reviewID: string
  tourTitle: string | null
  userName: string | null
  userEmail: string | null
  rating: number
  comment: string
  videoUrl?: string | null
  status: ReviewStatus
  createdAt: string
  adminReply?: string | null
  repliedAt?: string | null
  repliedBy?: string | null
}

export interface ReviewAdminListParams {
  page: number
  size: number
  status?: ReviewStatus
}

export interface ReviewAdminListResponse {
  content: ReviewAdmin[]
  totalPages: number
  number: number
  totalElements: number
}

