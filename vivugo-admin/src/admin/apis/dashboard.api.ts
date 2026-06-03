import http from "../../utils/http";
import type { AdminAiInsight, DashboardOverview, DashboardStats } from "../types/dashboard.type";

export const dashboardApi = {
  getStats: (params?: { year?: number; months?: number }) =>
    http.get<DashboardStats>("/admin/dashboard/stats", { params }),

  getOverview: (params?: { year?: number; months?: number }) =>
    http.get<DashboardOverview>("/admin/dashboard/overview", { params }),

  exportBookings: () =>
    http.get("/admin/dashboard/export", {
      responseType: "blob",
    }),

  generateAiInsights: (body: { year?: number; months?: number; question?: string }) =>
    http.post<AdminAiInsight>("/admin/ai/insights", body),
};
