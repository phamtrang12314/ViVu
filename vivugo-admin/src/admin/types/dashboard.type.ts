export interface TopTour {
  tourName: string
  bookingCount: number
  totalRevenue: number
}

export interface MonthlyRevenue {
  month: number
  revenue: number
}

export interface DashboardStats {
  totalRevenue: number
  totalBookings: number
  totalUsers: number
  newUsersThisMonth: number
  bookingStatusStats: Record<string, number>
  revenueTrend: MonthlyRevenue[]
  topSellingTours: TopTour[]
  pendingContactMessages: number
}

export interface MonthlyBooking {
  month: number
  bookings: number
}

export interface PendingTasks {
  bookingAwaitingConfirmation: number
  unrespondedMessages: number
  reviewsPendingApproval: number
  refundRequests: number
  toursNearlySoldOut: number
  total: number
}

export interface TopTourOverview {
  tourId: string
  tourName: string
  destination: string | null
  bookingCount: number
  totalRevenue: number
  status: string
}

export interface UpcomingTourOverview {
  tourId: string
  tourName: string
  departureDate: string
  bookedSeats: number
  totalSeats: number
  remainingSeats: number
  status: string
}

export interface RecentActivity {
  type: 'BOOKING' | 'PAYMENT' | 'REVIEW' | 'CONTACT' | string
  title: string
  description: string
  happenedAt: string
}

export interface DashboardOverview {
  year: number
  months: number
  stats: DashboardStats
  previousRevenue: number
  previousBookings: number
  previousUsers: number
  previousPendingTasks: number
  revenueChangePercent: number
  bookingsChangePercent: number
  usersChangePercent: number
  pendingTasksChangePercent: number
  revenueTrend: MonthlyRevenue[]
  bookingTrend: MonthlyBooking[]
  topTours: TopTourOverview[]
  pendingTasks: PendingTasks
  upcomingTours: UpcomingTourOverview[]
  recentActivities: RecentActivity[]
}

export interface AdminAiInsight {
  aiReport: string
  highlights: string[]
  risks: string[]
  recommendations: string[]
  generatedAt: string
}
