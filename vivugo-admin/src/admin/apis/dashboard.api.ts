import http from "../../utils/http";
import type { DashboardStats } from "../types/dashboard.type";

export const dashboardApi = {
    getStats: (params?: { year?: number; months?: number }) =>
        http.get<DashboardStats>("/admin/dashboard/stats", { params }),

    // API mới để xuất báo cáo (trả về Blob/File)
    exportBookings: () =>
        http.get("/admin/dashboard/export", {
            responseType: "blob",
        }),
};

