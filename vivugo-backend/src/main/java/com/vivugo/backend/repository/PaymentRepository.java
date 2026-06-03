package com.vivugo.backend.repository;

import com.vivugo.backend.model.Payment;
import com.vivugo.backend.model.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    // Có thể thêm các hàm tìm kiếm tùy chỉnh nếu cần sau này
    // Ví dụ: Tìm Payment theo TransactionCode
    Payment findByTransactionCode(String transactionCode);

    boolean existsByTransactionCode(String transactionCode);

    @Query("SELECT SUM(p.amountPaid) FROM Payment p WHERE p.status = :status")
    Double calculateTotalRevenue(@Param("status") PaymentStatus status);

    @Query("SELECT SUM(p.amountPaid) FROM Payment p " +
            "WHERE p.status = :status AND p.paymentDate >= :start AND p.paymentDate < :end")
    Double calculateTotalRevenueBetween(@Param("status") PaymentStatus status,
                                         @Param("start") LocalDateTime start,
                                         @Param("end") LocalDateTime end);

    @Query("SELECT MONTH(p.paymentDate) as month, SUM(p.amountPaid) as total " +
            "FROM Payment p " +
            "WHERE p.status = :status AND YEAR(p.paymentDate) = :year " +
            "GROUP BY MONTH(p.paymentDate) " +
            "ORDER BY MONTH(p.paymentDate) ASC")
    List<Object[]> findMonthlyRevenue(@Param("status") PaymentStatus status, @Param("year") int year);

    @Query("SELECT MONTH(p.paymentDate) as month, SUM(p.amountPaid) as total " +
            "FROM Payment p " +
            "WHERE p.status = :status AND p.paymentDate >= :start AND p.paymentDate < :end " +
            "GROUP BY MONTH(p.paymentDate) " +
            "ORDER BY MONTH(p.paymentDate) ASC")
    List<Object[]> findMonthlyRevenueBetween(@Param("status") PaymentStatus status,
                                             @Param("start") LocalDateTime start,
                                             @Param("end") LocalDateTime end);

    @Query("SELECT MAX(YEAR(p.paymentDate)) FROM Payment p WHERE p.status = :status")
    Integer findLatestPaymentYear(@Param("status") PaymentStatus status);

    long countByStatusAndPaymentDateBetween(PaymentStatus status, LocalDateTime start, LocalDateTime end);

    @EntityGraph(attributePaths = {"invoice", "invoice.booking", "invoice.booking.user", "invoice.booking.tour"})
    Page<Payment> findAllByStatusOrderByPaymentDateDesc(PaymentStatus status, Pageable pageable);
}
