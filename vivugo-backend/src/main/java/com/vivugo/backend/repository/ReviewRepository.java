package com.vivugo.backend.repository;

import com.vivugo.backend.model.Review;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.User;
import com.vivugo.backend.model.enums.ReviewStatus;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {

    /**
     * Tìm kiếm tất cả các review cho một tour với status cụ thể,
     * đồng thời tải (fetch) thông tin User liên quan để tránh lỗi N+1 và Lazy.
     */
    @Query("SELECT r FROM Review r JOIN FETCH r.user " +
            "WHERE r.tour.tourID = :tourId AND r.status = :status")
    Page<Review> findReviewsByTourAndStatus(
            @Param("tourId") String tourId,
            @Param("status") ReviewStatus status,
            Pageable pageable
    );
    Page<Review> findByStatus(ReviewStatus status, Pageable pageable);

    long countByStatus(ReviewStatus status);

    long countByStatusAndCreatedAtBetween(ReviewStatus status, LocalDateTime from, LocalDateTime to);

    @EntityGraph(attributePaths = {"user", "tour"})
    Page<Review> findAllByOrderByCreatedAtDesc(Pageable pageable);

    boolean existsByUserAndTour(User user, Tour tour);
}
