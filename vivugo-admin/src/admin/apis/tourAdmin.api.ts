import http from "../../utils/http";
import type { TourListAdminParams } from "../../types/tour";
import type { SimpleTour, TourDetailAdmin } from "../types/tourAdmin";

export const tourAdminApi = {
    getAllTours: (params: TourListAdminParams) => {
        // FIX: Xử lý tham số search để tránh gửi "undefined" lên URL
        const sanitizedParams = {
            ...params,
            search: params.search || "", // Nếu không có search, mặc định là chuỗi rỗng
        };

        return http.get("/admin/tours", { params: sanitizedParams });
    },

    getTourById: (id: string) => http.get<TourDetailAdmin>(`/admin/tours/${id}`),

    createTour: (data: any) => http.post("/admin/tours", data),

    updateTour: (id: string, data: any) => http.put(`/admin/tours/${id}`, data),

    completeTour: (id: string) => http.put(`/admin/tours/${id}/complete`, null),

    uploadTourImage(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        return http.post<{ url: string }>("/admin/uploads/tour-image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    getOpenToursSimple: () => http.get<SimpleTour[]>("/admin/tours/open-simple"),

    getCompletedToursSimple: () => http.get<SimpleTour[]>("/admin/tours/completed-simple"),

    searchToursForParticipants: (keyword?: string) =>
        http.get<SimpleTour[]>("/admin/tours/participants-search", {
            params: { keyword },
        }),
};

