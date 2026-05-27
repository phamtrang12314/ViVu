export type ReviewStatus = "PENDING" | "APPROVED" | "HIDDEN"

export interface ReviewAdmin {
  reviewID: number
  tourTitle: string | null
  userName: string | null
  userEmail: string | null
  rating: number
  content: string
  status: ReviewStatus
  createdAt: string
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

