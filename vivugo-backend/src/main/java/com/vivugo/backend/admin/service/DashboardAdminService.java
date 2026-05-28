package com.vivugo.backend.admin.service;

import com.vivugo.backend.admin.dto.response.dashboard.DashboardOverviewResponse;
import com.vivugo.backend.admin.dto.response.dashboard.DashboardStatsResponse;
import com.vivugo.backend.admin.dto.response.dashboard.MonthlyBookingDto;
import com.vivugo.backend.admin.dto.response.dashboard.MonthlyRevenueDto;
import com.vivugo.backend.admin.dto.response.dashboard.PendingTasksDto;
import com.vivugo.backend.admin.dto.response.dashboard.RecentActivityDto;
import com.vivugo.backend.admin.dto.response.dashboard.TopTourDto;
import com.vivugo.backend.admin.dto.response.dashboard.TopTourOverviewDto;
import com.vivugo.backend.admin.dto.response.dashboard.UpcomingTourDto;
import com.vivugo.backend.model.Booking;
import com.vivugo.backend.model.ContactMessage;
import com.vivugo.backend.model.Payment;
import com.vivugo.backend.model.Review;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.enums.BookingStatus;
import com.vivugo.backend.model.enums.PaymentStatus;
import com.vivugo.backend.model.enums.ReviewStatus;
import com.vivugo.backend.model.enums.TourStatus;
import com.vivugo.backend.repository.BookingRepository;
import com.vivugo.backend.repository.ContactMessageRepository;
import com.vivugo.backend.repository.PaymentRepository;
import com.vivugo.backend.repository.ReviewRepository;
import com.vivugo.backend.repository.TourRepository;
import com.vivugo.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardAdminService {
    private static final Logger log = LoggerFactory.getLogger(DashboardAdminService.class);


    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final ReviewRepository reviewRepository;
    private final TourRepository tourRepository;

    @Transactional
    public DashboardStatsResponse getDashboardStats(Integer requestedYear, Integer requestedMonths) {
        PeriodWindow period = resolvePeriod(requestedYear, requestedMonths);
        return buildDashboardStats(period);
    }

    @Transactional
    public DashboardOverviewResponse getDashboardOverview(Integer requestedYear, Integer requestedMonths) {
        PeriodWindow period = resolvePeriod(requestedYear, requestedMonths);
        DashboardStatsResponse stats = buildDashboardStats(period);

        double previousRevenue = defaultNumber(
                paymentRepository.calculateTotalRevenueBetween(PaymentStatus.SUCCESS, period.previousStart, period.previousEnd));
        long previousBookings = bookingRepository.countByBookingDateBetween(period.previousStart, period.previousEnd);
        long previousUsers = userRepository.countByCreatedAtBetween(period.previousStart, period.previousEnd);
        long previousPending = countPendingTasksForPeriod(period.previousStart, period.previousEnd);

        PendingTasksDto pendingTasks = buildPendingTasks();
        List<MonthlyBookingDto> bookingTrend = safeBuildBookingTrend(period);
        List<TopTourOverviewDto> topTours = safeLoadTopTours(period);
        List<UpcomingTourDto> upcomingTours = safeLoadUpcomingTours(5);

        return DashboardOverviewResponse.builder()
                .year(period.year)
                .months(period.months)
                .stats(stats)
                .previousRevenue(previousRevenue)
                .previousBookings(previousBookings)
                .previousUsers(previousUsers)
                .previousPendingTasks(previousPending)
                .revenueChangePercent(calculatePercentChange(stats.getTotalRevenue(), previousRevenue))
                .bookingsChangePercent(calculatePercentChange(stats.getTotalBookings().doubleValue(), (double) previousBookings))
                .usersChangePercent(calculatePercentChange(stats.getTotalUsers().doubleValue(), (double) previousUsers))
                .pendingTasksChangePercent(calculatePercentChange(pendingTasks.getTotal().doubleValue(), (double) previousPending))
                .revenueTrend(stats.getRevenueTrend())
                .bookingTrend(bookingTrend)
                .topTours(topTours)
                .pendingTasks(pendingTasks)
                .upcomingTours(upcomingTours)
                .recentActivities(safeBuildRecentActivities())
                .build();
    }

    public void exportBookingsToCsv(PrintWriter writer) {
        List<Booking> bookings = bookingRepository.findAll();
        writer.println("Booking ID,User Email,Tour Name,Booking Date,Total Price,Status");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        for (Booking booking : bookings) {
            writer.printf("%s,%s,%s,%s,%s,%s%n",
                    escapeSpecialCharacters(booking.getBookingID()),
                    escapeSpecialCharacters(booking.getUser().getEmail()),
                    escapeSpecialCharacters(booking.getTour().getTitle()),
                    booking.getBookingDate().format(formatter),
                    booking.getFinalAmount(),
                    booking.getStatus()
            );
        }
    }

    private DashboardStatsResponse buildDashboardStats(PeriodWindow period) {
        double revenue = defaultNumber(
                paymentRepository.calculateTotalRevenueBetween(PaymentStatus.SUCCESS, period.rangeStart, period.rangeEnd));
        long totalBookings = bookingRepository.countByBookingDateBetween(period.rangeStart, period.rangeEnd);
        Map<String, Long> statusMap = buildBookingStatusMap(period.rangeStart, period.rangeEnd);
        long totalUsers = userRepository.count();
        long newUsers = userRepository.countByCreatedAtBetween(period.rangeStart, period.rangeEnd);
        List<TopTourDto> topTours = bookingRepository.findTopPaidToursBetween(
                PaymentStatus.SUCCESS,
                period.rangeStart,
                period.rangeEnd,
                PageRequest.of(0, 5)
        );
        long pendingContactMessages = safeCountUnrespondedMessages();
        List<MonthlyRevenueDto> revenueTrend = safeBuildRevenueTrend(period);

        return DashboardStatsResponse.builder()
                .totalRevenue(revenue)
                .totalBookings(totalBookings)
                .bookingStatusStats(statusMap)
                .revenueTrend(revenueTrend)
                .totalUsers(totalUsers)
                .newUsersThisMonth(newUsers)
                .topSellingTours(topTours)
                .pendingContactMessages(pendingContactMessages)
                .build();
    }

    private List<MonthlyRevenueDto> buildRevenueTrend(PeriodWindow period) {
        List<Object[]> monthlyData = paymentRepository.findMonthlyRevenueBetween(PaymentStatus.SUCCESS, period.rangeStart, period.rangeEnd);
        Map<Integer, Double> revenueMap = new HashMap<>();
        for (Object[] row : monthlyData) {
            Integer month = (Integer) row[0];
            Double amount = (Double) row[1];
            revenueMap.put(month, amount);
        }

        List<MonthlyRevenueDto> trend = new ArrayList<>();
        for (int month = period.startMonth; month <= 12; month++) {
            trend.add(new MonthlyRevenueDto(month, revenueMap.getOrDefault(month, 0.0)));
        }
        return trend;
    }

    private List<MonthlyBookingDto> buildBookingTrend(PeriodWindow period) {
        List<Object[]> monthlyData = bookingRepository.countMonthlyBookingsBetween(period.rangeStart, period.rangeEnd);
        Map<Integer, Long> bookingMap = new HashMap<>();
        for (Object[] row : monthlyData) {
            Integer month = (Integer) row[0];
            Long bookings = (Long) row[1];
            bookingMap.put(month, bookings);
        }

        List<MonthlyBookingDto> trend = new ArrayList<>();
        for (int month = period.startMonth; month <= 12; month++) {
            trend.add(new MonthlyBookingDto(month, bookingMap.getOrDefault(month, 0L)));
        }
        return trend;
    }

    private List<MonthlyBookingDto> safeBuildBookingTrend(PeriodWindow period) {
        try {
            return buildBookingTrend(period);
        } catch (Exception ex) {
            log.warn("Failed to build booking trend, using empty fallback", ex);
            List<MonthlyBookingDto> fallback = new ArrayList<>();
            for (int month = period.startMonth; month <= 12; month++) {
                fallback.add(new MonthlyBookingDto(month, 0L));
            }
            return fallback;
        }
    }

    private List<TopTourOverviewDto> safeLoadTopTours(PeriodWindow period) {
        try {
            return bookingRepository.findTopPaidTourOverviewBetween(
                    PaymentStatus.SUCCESS, period.rangeStart, period.rangeEnd, PageRequest.of(0, 5));
        } catch (Exception ex) {
            log.warn("Failed to load top tours overview, using empty fallback", ex);
            return new ArrayList<>();
        }
    }

    private Map<String, Long> buildBookingStatusMap(LocalDateTime start, LocalDateTime end) {
        List<Object[]> statusCounts = bookingRepository.countBookingsByStatusBetween(start, end);
        Map<String, Long> statusMap = new HashMap<>();
        statusMap.put(BookingStatus.CONFIRMED.name(), 0L);
        statusMap.put(BookingStatus.PROCESSING.name(), 0L);
        statusMap.put(BookingStatus.COMPLETED.name(), 0L);
        statusMap.put(BookingStatus.CANCELED.name(), 0L);
        statusMap.put(BookingStatus.CANCELLATION_REQUESTED.name(), 0L);

        for (Object[] row : statusCounts) {
            if (row[0] != null) {
                statusMap.put(row[0].toString(), (Long) row[1]);
            }
        }
        return statusMap;
    }

    private PendingTasksDto buildPendingTasks() {
        long bookingAwaitingConfirmation = bookingRepository.countByStatus(BookingStatus.PROCESSING);
        long unrespondedMessages = safeCountUnrespondedMessages();
        long reviewsPendingApproval = reviewRepository.countByStatus(ReviewStatus.PENDING);
        long refundRequests = bookingRepository.countByStatus(BookingStatus.CANCELLATION_REQUESTED);

        List<UpcomingTourDto> nearSoldOutTours = loadUpcomingTours(50);
        long toursNearlySoldOut = nearSoldOutTours.stream()
                .filter(tour -> tour.getRemainingSeats() != null && tour.getRemainingSeats() > 0 && tour.getRemainingSeats() <= 5)
                .count();

        long total = bookingAwaitingConfirmation + unrespondedMessages + reviewsPendingApproval + refundRequests + toursNearlySoldOut;
        return PendingTasksDto.builder()
                .bookingAwaitingConfirmation(bookingAwaitingConfirmation)
                .unrespondedMessages(unrespondedMessages)
                .reviewsPendingApproval(reviewsPendingApproval)
                .refundRequests(refundRequests)
                .toursNearlySoldOut(toursNearlySoldOut)
                .total(total)
                .build();
    }

    private long countPendingTasksForPeriod(LocalDateTime start, LocalDateTime end) {
        long bookingAwaitingConfirmation = bookingRepository.countByStatusAndBookingDateBetween(
                BookingStatus.PROCESSING, start, end);
        long unrespondedMessages = safeCountUnrespondedMessagesBetween(start, end);
        long reviewsPendingApproval = reviewRepository.countByStatusAndCreatedAtBetween(ReviewStatus.PENDING, start, end);
        long refundRequests = bookingRepository.countByStatusAndBookingDateBetween(
                BookingStatus.CANCELLATION_REQUESTED, start, end);
        return bookingAwaitingConfirmation + unrespondedMessages + reviewsPendingApproval + refundRequests;
    }

    private long safeCountUnrespondedMessages() {
        try {
            return contactMessageRepository.countByRespondedFalse();
        } catch (Exception ex) {
            log.warn("Fallback to total contact message count because responded flag query failed", ex);
            return contactMessageRepository.count();
        }
    }

    private long safeCountUnrespondedMessagesBetween(LocalDateTime start, LocalDateTime end) {
        try {
            return contactMessageRepository.countByRespondedFalseAndSentAtBetween(start, end);
        } catch (Exception ex) {
            log.warn("Fallback to sent-at range count because responded flag range query failed", ex);
            return contactMessageRepository.countBySentAtBetween(start, end);
        }
    }

    private List<MonthlyRevenueDto> safeBuildRevenueTrend(PeriodWindow period) {
        try {
            return buildRevenueTrend(period);
        } catch (Exception ex) {
            log.warn("Failed to build revenue trend, using empty fallback", ex);
            List<MonthlyRevenueDto> fallback = new ArrayList<>();
            for (int month = period.startMonth; month <= 12; month++) {
                fallback.add(new MonthlyRevenueDto(month, 0.0));
            }
            return fallback;
        }
    }

    private List<UpcomingTourDto> normalizeUpcomingTours(List<UpcomingTourDto> rawTours) {
        List<UpcomingTourDto> normalized = new ArrayList<>();
        for (UpcomingTourDto tour : rawTours) {
            long bookedSeats = tour.getBookedSeats() == null ? 0L : Math.max(0L, tour.getBookedSeats());
            int totalSeats = tour.getTotalSeats() == null ? 0 : Math.max(0, tour.getTotalSeats());
            int remainingSeats = Math.max(0, totalSeats - (int) bookedSeats);
            normalized.add(new UpcomingTourDto(
                    tour.getTourId(),
                    tour.getTourName(),
                    tour.getDepartureDate(),
                    bookedSeats,
                    totalSeats,
                    remainingSeats,
                    tour.getStatus()
            ));
        }
        return normalized;
    }

    private List<UpcomingTourDto> loadUpcomingTours(int limit) {
        List<Tour> candidates = new ArrayList<>();
        candidates.addAll(tourRepository.findByStatus(TourStatus.ACTIVE));
        candidates.addAll(tourRepository.findByStatus(TourStatus.PAUSE));
        candidates.addAll(tourRepository.findByStatus(TourStatus.SOLD_OUT));

        LocalDate today = LocalDate.now();
        List<UpcomingTourDto> result = new ArrayList<>();

        candidates.stream()
                .filter(tour -> tour.getStartDate() != null && !tour.getStartDate().isBefore(today))
                .sorted(Comparator.comparing(Tour::getStartDate))
                .limit(limit)
                .forEach(tour -> {
                    List<Booking> bookings = bookingRepository.findByTour_TourIDAndStatusNot(
                            tour.getTourID(), BookingStatus.CANCELED);
                    long bookedSeats = bookings.stream()
                            .mapToLong(booking -> (long) booking.getNumAdults() + booking.getNumChildren())
                            .sum();
                    int totalSeats = Math.max(0, tour.getMaxParticipants());
                    int remainingSeats = Math.max(0, totalSeats - (int) bookedSeats);
                    result.add(new UpcomingTourDto(
                            tour.getTourID(),
                            tour.getTitle(),
                            tour.getStartDate(),
                            bookedSeats,
                            totalSeats,
                            remainingSeats,
                            tour.getStatus()
                    ));
                });

        return result;
    }

    private List<UpcomingTourDto> safeLoadUpcomingTours(int limit) {
        try {
            return loadUpcomingTours(limit);
        } catch (Exception ex) {
            log.warn("Failed to load upcoming tours, using empty fallback", ex);
            return new ArrayList<>();
        }
    }

    private List<RecentActivityDto> buildRecentActivities() {
        List<RecentActivityDto> items = new ArrayList<>();

        List<Booking> latestBookings = bookingRepository.findAllByOrderByBookingDateDesc(PageRequest.of(0, 4)).getContent();
        for (Booking booking : latestBookings) {
            String userName = booking.getUser() != null ? safeString(booking.getUser().getName(), "Khách hàng") : "Khách hàng";
            String tourName = booking.getTour() != null ? safeString(booking.getTour().getTitle(), "tour") : "tour";
            items.add(RecentActivityDto.builder()
                    .type("BOOKING")
                    .title(userName + " vừa đặt tour " + tourName)
                    .description("Mã booking: " + safeString(booking.getBookingID(), "N/A"))
                    .happenedAt(booking.getBookingDate())
                    .build());
        }

        List<Payment> latestPayments = paymentRepository.findAllByStatusOrderByPaymentDateDesc(
                PaymentStatus.SUCCESS, PageRequest.of(0, 3)).getContent();
        for (Payment payment : latestPayments) {
            Booking booking = payment.getInvoice() != null ? payment.getInvoice().getBooking() : null;
            if (booking == null) {
                continue;
            }
            String userName = booking.getUser() != null ? safeString(booking.getUser().getName(), "Khách hàng") : "Khách hàng";
            String tourName = booking.getTour() != null ? safeString(booking.getTour().getTitle(), "tour") : "tour";
            items.add(RecentActivityDto.builder()
                    .type("PAYMENT")
                    .title(userName + " đã thanh toán thành công")
                    .description("Tour " + tourName + " - " + formatMoney(payment.getAmountPaid()))
                    .happenedAt(payment.getPaymentDate())
                    .build());
        }

        List<Review> latestReviews = reviewRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 3)).getContent();
        for (Review review : latestReviews) {
            String tourName = review.getTour() != null ? safeString(review.getTour().getTitle(), "tour") : "tour";
            items.add(RecentActivityDto.builder()
                    .type("REVIEW")
                    .title("Có review mới cho tour " + tourName)
                    .description("Trạng thái: " + review.getStatus().name())
                    .happenedAt(review.getCreatedAt())
                    .build());
        }

        List<ContactMessage> latestMessages = contactMessageRepository.findAllByOrderBySentAtDesc(PageRequest.of(0, 2)).getContent();
        for (ContactMessage message : latestMessages) {
            String sender = safeString(message.getName(), "Khách");
            items.add(RecentActivityDto.builder()
                    .type("CONTACT")
                    .title(sender + " vừa gửi tin nhắn liên hệ")
                    .description(safeString(message.getSubject(), safeString(message.getEmail(), "Không có chủ đề")))
                    .happenedAt(message.getSentAt())
                    .build());
        }

        items.sort(Comparator.comparing(RecentActivityDto::getHappenedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed());
        if (items.size() <= 8) {
            return items;
        }
        return new ArrayList<>(items.subList(0, 8));
    }

    private List<RecentActivityDto> safeBuildRecentActivities() {
        try {
            return buildRecentActivities();
        } catch (Exception ex) {
            log.warn("Failed to build recent activities, using empty fallback", ex);
            return new ArrayList<>();
        }
    }

    private PeriodWindow resolvePeriod(Integer requestedYear, Integer requestedMonths) {
        Integer latestPaymentYear = paymentRepository.findLatestPaymentYear(PaymentStatus.SUCCESS);
        int year = requestedYear != null
                ? requestedYear
                : (latestPaymentYear != null ? latestPaymentYear : LocalDate.now().getYear());
        int months = Math.max(1, Math.min(requestedMonths != null ? requestedMonths : 12, 12));
        int startMonth = 12 - months + 1;
        LocalDateTime rangeStart = LocalDate.of(year, startMonth, 1).atStartOfDay();
        LocalDateTime rangeEnd = LocalDate.of(year, 12, 31).plusDays(1).atStartOfDay();
        LocalDateTime previousStart = rangeStart.minusMonths(months);
        LocalDateTime previousEnd = rangeStart;
        return new PeriodWindow(year, months, startMonth, rangeStart, rangeEnd, previousStart, previousEnd);
    }

    private double defaultNumber(Double value) {
        return value == null ? 0.0 : value;
    }

    private double calculatePercentChange(double current, double previous) {
        if (previous == 0.0) {
            return current == 0.0 ? 0.0 : 100.0;
        }
        return ((current - previous) / previous) * 100.0;
    }

    private String formatMoney(Double value) {
        if (value == null) {
            return "0 đ";
        }
        return String.format(Locale.ROOT, "%,.0f đ", value);
    }

    private String safeString(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private String escapeSpecialCharacters(String data) {
        if (data == null) {
            return "";
        }
        String escapedData = data.replaceAll("\\R", " ");
        if (data.contains(",") || data.contains("\"") || data.contains("'")) {
            data = data.replace("\"", "\"\"");
            escapedData = "\"" + data + "\"";
        }
        return escapedData;
    }

    private record PeriodWindow(
            int year,
            int months,
            int startMonth,
            LocalDateTime rangeStart,
            LocalDateTime rangeEnd,
            LocalDateTime previousStart,
            LocalDateTime previousEnd
    ) {
    }
}
