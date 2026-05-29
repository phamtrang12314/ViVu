/* eslint-disable @typescript-eslint/no-explicit-any */
import http from "../../utils/http"
import type {
  ReviewAdminListParams,
  ReviewAdminListResponse,
  ReviewStatus
} from "../types/reviewAdmin.type"

const URL = "/admin/reviews"

export const reviewAdminApi = {
  getAll(params: ReviewAdminListParams) {
    return http.get<ReviewAdminListResponse>(URL, { params })
  },

  updateStatus(reviewId: number, status: ReviewStatus) {
    return http.patch(`${URL}/${reviewId}/status`, { status })
  }
}

