package com.vivugo.backend.admin.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsResponse {
    // 1. Metric Cards
    private Double totalRevenue;         // Tổng doanh thu từ Payment SUCCESS
    private Long totalBookings;          // Tổng số booking
    private Long totalUsers;             // Tổng user
    private Long newUsersThisMonth;      // User mới tạo trong tháng

    // 2. Pie Chart Data (Map<BookingStatus, Long>)
    private Map<String, Long> bookingStatusStats;

    // 3. Area Chart Data (Doanh thu theo tháng trong năm hiện tại)
    private List<MonthlyRevenueDto> revenueTrend;

    // 4. Top List
    private List<TopTourDto> topSellingTours;

    // 5. Alerts
    private Long pendingContactMessages; // Tin nhắn chưa phản hồi
}