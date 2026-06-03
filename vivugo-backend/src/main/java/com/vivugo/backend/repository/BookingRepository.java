package com.vivugo.backend.repository;

import com.vivugo.backend.admin.dto.response.dashboard.TopTourDto;
import com.vivugo.backend.admin.dto.response.dashboard.TopTourOverviewDto;
import com.vivugo.backend.model.Booking;
import com.vivugo.backend.model.enums.BookingStatus;
import com.vivugo.backend.model.enums.PaymentStatus;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, String>, JpaSpecificationExecutor<Booking> {

    List<Booking> findByStatusAndBookingDateBefore(BookingStatus status, LocalDateTime dateTime);

    List<Booking> findByUser_UserID(String userId);

    long countByUser_UserID(String userId);

    long countByUser_UserIDAndStatus(String userId, BookingStatus status);

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.user.userID = :userId")
    Double sumTotalAmountByUser(@Param("userId") String userId);

    @EntityGraph(attributePaths = {"tour"})
    List<Booking> findAllByUser_userID(String userId);

    @Query("SELECT b.status, COUNT(b) FROM Booking b GROUP BY b.status")
    List<Object[]> countBookingsByStatus();

    @Query("SELECT b.status, COUNT(b) FROM Booking b " +
            "WHERE b.bookingDate >= :start AND b.bookingDate < :end " +
            "GROUP BY b.status")
    List<Object[]> countBookingsByStatusBetween(@Param("start") LocalDateTime start,
                                                @Param("end") LocalDateTime end);

    @Query("SELECT new com.vivugo.backend.admin.dto.response.dashboard.TopTourDto(" +
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

    @Query("SELECT new com.vivugo.backend.admin.dto.response.dashboard.TopTourOverviewDto(" +
            "b.tour.tourID, b.tour.title, b.tour.departurePlace, COUNT(DISTINCT b.bookingID), SUM(p.amountPaid), b.tour.status) " +
            "FROM Booking b JOIN b.invoice i JOIN i.payments p " +
            "WHERE p.status = :status AND p.paymentDate >= :start AND p.paymentDate < :end " +
            "GROUP BY b.tour.tourID, b.tour.title, b.tour.departurePlace, b.tour.status " +
            "ORDER BY SUM(p.amountPaid) DESC")
    List<TopTourOverviewDto> findTopPaidTourOverviewBetween(@Param("status") PaymentStatus status,
                                                            @Param("start") LocalDateTime start,
                                                            @Param("end") LocalDateTime end,
                                                            Pageable pageable);

    @Query("SELECT MONTH(b.bookingDate), COUNT(b) " +
            "FROM Booking b " +
            "WHERE b.bookingDate >= :start AND b.bookingDate < :end " +
            "GROUP BY MONTH(b.bookingDate) " +
            "ORDER BY MONTH(b.bookingDate) ASC")
    List<Object[]> countMonthlyBookingsBetween(@Param("start") LocalDateTime start,
                                               @Param("end") LocalDateTime end);

    long countByBookingDateBetween(LocalDateTime start, LocalDateTime end);

    long countByBookingDateBetweenAndStatus(LocalDateTime start, LocalDateTime end, BookingStatus status);

    long countByStatusAndBookingDateBetween(BookingStatus status, LocalDateTime start, LocalDateTime end);

    List<Booking> findByStatus(BookingStatus status);

    long countByStatus(BookingStatus status);

    List<Booking> findByTour_TourIDAndStatusNot(String tourID, BookingStatus status);

    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"tour", "user"})
    Page<Booking> findAllByOrderByBookingDateDesc(Pageable pageable);
}
