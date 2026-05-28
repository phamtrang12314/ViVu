import http from "../utils/http";
import type { DestinationApiResponse } from "../types/destination";

export const destinationApi = {
    getPopularDestinations: () => {
        // Lấy các điểm đến
        return http.get<DestinationApiResponse>("destinations");
    },
};

