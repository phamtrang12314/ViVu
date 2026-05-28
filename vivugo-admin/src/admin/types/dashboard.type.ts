export interface TopTour {
    tourName: string;
    bookingCount: number;
    totalRevenue: number;
}

export interface MonthlyRevenue {
    month: number;
    revenue: number;
}

export interface DashboardStats {
    totalRevenue: number;
    totalBookings: number;
    totalUsers: number;
    newUsersThisMonth: number;
    // Backend trả về Map<String, Long> -> Frontend là Record<string, number>
    bookingStatusStats: Record<string, number>;
    // Dữ liệu mới cho biểu đồ miền
    revenueTrend: MonthlyRevenue[];
    topSellingTours: TopTour[];
    pendingContactMessages: number;
}

