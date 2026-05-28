import http from "../../utils/http";
import type { DestinationAdmin, DestinationAdminListParams, DestinationDetailAdmin, DestinationSave } from "../types/destinationAdmin";

export const destinationAdminApi = {
  // Dùng cho form tạo tour (combobox điểm đến)
  getDestinationsForTour(region?: string) {
    return http.get<DestinationAdmin[]>("admin/destinations/tour", {
      params: region ? { region } : {},
    });
  },

  // Dùng cho màn Manage Destination (phân trang + search + filter)
  getAdminDestinations(params: DestinationAdminListParams) {
    return http.get<{
      content: DestinationAdmin[];
      totalPages: number;
      number: number; // current page index (0-based)
    }>("admin/destinations", {
      params,
    });
  },

  getDestinationById: (id: string) => http.get<DestinationDetailAdmin >(`/admin/destinations/${id}`),

  createDestination(data: DestinationSave) {
    return http.post<DestinationAdmin>("/admin/destinations", data);
  },

  updateDestination(id: string, data: DestinationSave) {
    return http.put<DestinationAdmin>(`/admin/destinations/${id}`, data);
  },

  uploadDestinationImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return http.post<{ url: string }>(
      "/admin/uploads/destination-image",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },
};



