// frontend-demo/src/apis/favorite.api.ts
import http from "../utils/http";

interface FavoriteRequestBody {
    tourId: string;
}

type FavoriteSuccessResponse = unknown;
type FavoriteDeleteResponse = unknown;

export const favoriteApi = {
    addFavorite: (body: FavoriteRequestBody) => {
        return http.post<FavoriteSuccessResponse>("favorites", body);
    },

    removeFavorite: (tourId: string) => {
        return http.delete<FavoriteDeleteResponse>(`favorites/tour/${tourId}`);
    },

    // (1) THÊM API MỚI
    /**
     * Lấy danh sách ID của các tour đã yêu thích
     * API: GET /api/favorites/my-ids
     */
    getMyFavoriteIds: () => {
        // Backend trả về một mảng string: ["id1", "id2", ...]
        return http.get<string[]>("favorites/my-ids");
    },
};

