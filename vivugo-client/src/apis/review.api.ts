// frontend-demo/src/apis/review.api.ts
import http from "../utils/http";
import type { ReviewApiResponse } from "../types/review.type";

interface CreateReviewBody {
  tourId: string;
  rating: number;
  comment: string;
  videoUrl?: string;
}

export const reviewApi = {
  getReviewsForTour: (
    tourId: string,
    params: {
      page: number;
      size: number;
    }
  ) => {
    return http.get<ReviewApiResponse>(`reviews/tour/${tourId}`, {
      params,
    });
  },

  createReview: (body: CreateReviewBody) => {
    return http.post<string>(`reviews`, body);
  },

  uploadReviewMedia: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return http.post<{ url: string }>(`reviews/media`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  hasReviewed: (tourId: string) => {
    return http.get<boolean>(`reviews/tour/${tourId}/reviewed`);
  },
};

