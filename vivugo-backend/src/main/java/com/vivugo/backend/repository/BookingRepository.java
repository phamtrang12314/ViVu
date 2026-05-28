package com.vivugo.backend.repository;

import com.vivugo.backend.admin.dto.response.dashboard.TopTourDto;
import com.vivugo.backend.model.Booking;
import com.vivugo.backend.model.enums.BookingStatus;
import com.vivugo.backend.model.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, String>, JpaSpecificationExecutor<Booking> {

    List<Booking> findByStatusAndBookingDateBefore(BookingStatus status, LocalDateTime dateTime);

    List<Booking> findByUser_UserID(String userId);

    long countByUser_UserID(String userId);

    long countByUser_UserIDAndStatus(String userId, BookingStatus status);

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.user.userID = :userId")
    Double sumTotalAmountByUser(@Param("userId") String userId);

    @EntityGraph(attributePaths = {"tour"})
    List<Booking> findAllByUser_userID(String userId);

    // Thống kê số lượng theo từng trạng thái
    @Query("SELECT b.status, COUNT(b) FROM Booking b GROUP BY b.status")
    List<Object[]> countBookingsByStatus();

    @Query("SELECT b.status, COUNT(b) FROM Booking b " +
            "WHERE b.bookingDate >= :start AND b.bookingDate < :end " +
            "GROUP BY b.status")
    List<Object[]> countBookingsByStatusBetween(@Param("start") LocalDateTime start,
                                                @Param("end") LocalDateTime end);

    // Lấy Top Tour bán chạy dựa trên số lượng booking đã HOÀN THÀNH
    // Dùng 'finalAmount' để tính doanh thu, 'title' từ Tour
    @Query("SELECT new com.vivugo.backend.admin.dto.response.dashboard.TopTourDto(" + // Đã sửa đường dẫn
            "b.tour.title, COUNT(b), SUM(b.finalAmount)) " +
            "FROM Booking b " +
            "WHERE b.status = :status " +
            "GROUP BY b.tour.title " +
            "ORDER BY COUNT(b) DESC")
    List<TopTourDto> findTopSellingTours(@Param("status") BookingStatus status, Pageable pageable);

    @Query("SELECT new com.vivugo.backend.admin.dto.response.dashboard.TopTourDto(" +
            "b.tour.title, COUNT(b), SUM(b.finalAmount)) " +
            "FROM Booking b " +
            "WHERE b.status = :status AND b.bookingDate >= :start AND b.bookingDate < :end " +
            "GROUP BY b.tour.title " +
            "ORDER BY COUNT(b) DESC")
    List<TopTourDto> findTopSellingToursBetween(@Param("status") BookingStatus status,
                                                @Param("start") LocalDateTime start,
                                                @Param("end") LocalDateTime end,
                                                Pageable pageable);

    @Query("SELECT new com.vivugo.backend.admin.dto.response.dashboard.TopTourDto(" +
            "b.tour.title, COUNT(DISTINCT b.bookingID), SUM(p.amountPaid)) " +
            "FROM Booking b JOIN b.invoice i JOIN i.payments p " +
            "WHERE p.status = :status AND p.paymentDate >= :start AND p.paymentDate < :end " +
            "GROUP BY b.tour.title " +
            "ORDER BY SUM(p.amountPaid) DESC")
    List<TopTourDto> findTopPaidToursBetween(@Param("status") PaymentStatus status,
                                             @Param("start") LocalDateTime start,
                                             @Param("end") LocalDateTime end,
                                             Pageable pageable);

    long countByBookingDateBetween(LocalDateTime start, LocalDateTime end);

    long countByBookingDateBetweenAndStatus(LocalDateTime start, LocalDateTime end, BookingStatus status);

    List<Booking> findByStatus(BookingStatus status);

    // Lấy tất cả booking của 1 tour (trừ đã hủy nếu muốn)
    List<Booking> findByTour_TourIDAndStatusNot(String tourID, BookingStatus status);

    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);
}
