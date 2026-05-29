import type { TourType } from "../types/tourType.type";
import http from "../utils/http";

const URL = "tour-types"; // Giả sử endpoint là /api/tour-types

export const tourTypeApi = {
    getTourTypes() {
        return http.get<TourType[]>(URL);
    },
};

