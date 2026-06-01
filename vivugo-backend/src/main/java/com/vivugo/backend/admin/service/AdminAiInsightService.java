package com.vivugo.backend.admin.service;

import com.vivugo.backend.admin.dto.request.AdminAiInsightRequest;
import com.vivugo.backend.admin.dto.response.dashboard.AdminAiInsightResponse;
import com.vivugo.backend.admin.dto.response.dashboard.DashboardOverviewResponse;
import com.vivugo.backend.admin.dto.response.dashboard.PendingTasksDto;
import com.vivugo.backend.admin.dto.response.dashboard.TopTourOverviewDto;
import com.vivugo.backend.service.AiProviderClient;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class AdminAiInsightService {

    private final DashboardAdminService dashboardAdminService;
    private final AiProviderClient aiProviderClient;

    public AdminAiInsightService(DashboardAdminService dashboardAdminService, AiProviderClient aiProviderClient) {
        this.dashboardAdminService = dashboardAdminService;
        this.aiProviderClient = aiProviderClient;
    }

    public AdminAiInsightResponse generateInsights(AdminAiInsightRequest request) {
        Integer year = request == null ? null : request.getYear();
        Integer months = request == null ? null : request.getMonths();
        String question = request == null ? null : request.getQuestion();
        DashboardOverviewResponse overview = dashboardAdminService.getDashboardOverview(year, months);

        List<String> highlights = buildHighlights(overview);
        List<String> risks = buildRisks(overview);
        List<String> recommendations = buildRecommendations(overview);

        String fallback = String.join("\n",
                "Bao cao nhanh:",
                "- " + String.join("\n- ", highlights),
                "Rui ro can xu ly:",
                "- " + String.join("\n- ", risks),
                "De xuat:",
                "- " + String.join("\n- ", recommendations)
        );

        String aiReport = aiProviderClient.callAdminAnalysis(
                """
                        You are ViVuGo Admin AI, a business analyst for a tour booking system.
                        Answer in Vietnamese. Use only the provided dashboard facts.
                        Provide concise analysis, risks, and next actions. Do not invent numbers.
                        """,
                buildPrompt(overview, question),
                fallback
        );

        return new AdminAiInsightResponse(aiReport, highlights, risks, recommendations, LocalDateTime.now());
    }

    private String buildPrompt(DashboardOverviewResponse overview, String question) {
        StringBuilder builder = new StringBuilder();
        builder.append("Dashboard period: year=").append(overview.getYear())
                .append(", months=").append(overview.getMonths()).append('\n');
        builder.append("Total revenue: ").append(formatMoney(overview.getStats().getTotalRevenue())).append('\n');
        builder.append("Revenue change percent: ").append(formatPercent(overview.getRevenueChangePercent())).append('\n');
        builder.append("Total bookings: ").append(overview.getStats().getTotalBookings()).append('\n');
        builder.append("Bookings change percent: ").append(formatPercent(overview.getBookingsChangePercent())).append('\n');
        builder.append("Total users: ").append(overview.getStats().getTotalUsers()).append('\n');
        builder.append("New users in period: ").append(overview.getStats().getNewUsersThisMonth()).append('\n');
        builder.append("Booking status counts: ").append(overview.getStats().getBookingStatusStats()).append('\n');

        PendingTasksDto pending = overview.getPendingTasks();
        if (pending != null) {
            builder.append("Pending tasks: total=").append(pending.getTotal())
                    .append(", bookingAwaitingConfirmation=").append(pending.getBookingAwaitingConfirmation())
                    .append(", unrespondedMessages=").append(pending.getUnrespondedMessages())
                    .append(", reviewsPendingApproval=").append(pending.getReviewsPendingApproval())
                    .append(", refundRequests=").append(pending.getRefundRequests())
                    .append(", toursNearlySoldOut=").append(pending.getToursNearlySoldOut())
                    .append('\n');
        }

        builder.append("Top tours:\n");
        for (TopTourOverviewDto tour : overview.getTopTours()) {
            builder.append("- ").append(tour.getTourName())
                    .append(": bookings=").append(tour.getBookingCount())
                    .append(", revenue=").append(formatMoney(tour.getTotalRevenue()))
                    .append(", destination=").append(tour.getDestination())
                    .append(", status=").append(tour.getStatus())
                    .append('\n');
        }

        if (question != null && !question.isBlank()) {
            builder.append("Admin question: ").append(question.trim()).append('\n');
        }
        return builder.toString();
    }

    private List<String> buildHighlights(DashboardOverviewResponse overview) {
        List<String> items = new ArrayList<>();
        items.add("Doanh thu ky nay: " + formatMoney(overview.getStats().getTotalRevenue())
                + " (" + formatPercent(overview.getRevenueChangePercent()) + " so voi ky truoc).");
        items.add("Tong booking: " + overview.getStats().getTotalBookings()
                + " (" + formatPercent(overview.getBookingsChangePercent()) + " so voi ky truoc).");
        if (overview.getTopTours() != null && !overview.getTopTours().isEmpty()) {
            TopTourOverviewDto topTour = overview.getTopTours().get(0);
            items.add("Tour noi bat: " + topTour.getTourName() + " voi "
                    + topTour.getBookingCount() + " booking.");
        }
        return items;
    }

    private List<String> buildRisks(DashboardOverviewResponse overview) {
        List<String> items = new ArrayList<>();
        PendingTasksDto pending = overview.getPendingTasks();
        if (pending != null && pending.getBookingAwaitingConfirmation() > 0) {
            items.add("Con " + pending.getBookingAwaitingConfirmation() + " booking dang cho xac nhan.");
        }
        if (pending != null && pending.getRefundRequests() > 0) {
            items.add("Co " + pending.getRefundRequests() + " yeu cau huy/hoan tien can xu ly som.");
        }
        if (pending != null && pending.getToursNearlySoldOut() > 0) {
            items.add("Co " + pending.getToursNearlySoldOut() + " tour sap het cho, can theo doi suc chua.");
        }
        Map<String, Long> statusCounts = overview.getStats().getBookingStatusStats();
        Long canceled = statusCounts == null ? 0L : statusCounts.getOrDefault("CANCELED", 0L);
        if (canceled > 0) {
            items.add("Co " + canceled + " booking da huy trong ky.");
        }
        if (items.isEmpty()) {
            items.add("Chua phat hien rui ro lon tu cac chi so hien co.");
        }
        return items;
    }

    private List<String> buildRecommendations(DashboardOverviewResponse overview) {
        List<String> items = new ArrayList<>();
        if (overview.getRevenueChangePercent() < 0) {
            items.add("Kiem tra cac tour doanh thu giam va tao uu dai cho nhom diem den co nhu cau tot.");
        } else {
            items.add("Tang hien thi cac tour dang ban tot tren trang chu va goi y ca nhan.");
        }
        if (overview.getPendingTasks() != null && overview.getPendingTasks().getUnrespondedMessages() > 0) {
            items.add("Uu tien phan hoi tin nhan khach hang de giam mat co hoi chot booking.");
        }
        items.add("Theo doi tour sap khoi hanh va sap het cho de dieu chinh ton cho hoac truyen thong.");
        return items;
    }

    private String formatMoney(Double value) {
        double safeValue = value == null ? 0.0 : value;
        return String.format(Locale.forLanguageTag("vi-VN"), "%,.0f VND", safeValue);
    }

    private String formatPercent(Double value) {
        double safeValue = value == null ? 0.0 : value;
        return String.format(Locale.ROOT, "%+.1f%%", safeValue);
    }
}
