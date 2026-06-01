package com.vivugo.backend.admin.dto.response.dashboard;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardOverviewResponse {
    private Integer year;
    private Integer months;
    private DashboardStatsResponse stats;

    private Double previousRevenue;
    private Long previousBookings;
    private Long previousUsers;
    private Long previousPendingTasks;

    private Double revenueChangePercent;
    private Double bookingsChangePercent;
    private Double usersChangePercent;
    private Double pendingTasksChangePercent;

    private List<MonthlyRevenueDto> revenueTrend;
    private List<MonthlyBookingDto> bookingTrend;
    private List<TopTourOverviewDto> topTours;
    private PendingTasksDto pendingTasks;
    private List<UpcomingTourDto> upcomingTours;
    private List<RecentActivityDto> recentActivities;
}
