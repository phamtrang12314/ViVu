package com.vivugo.backend.repository;

import com.vivugo.backend.model.Destination;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.enums.TourStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query; // (MỚI)
import org.springframework.data.repository.query.Param; // (MỚI)
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional; // (MỚI)

@Repository
public interface TourRepository extends JpaRepository<Tour, String>, JpaSpecificationExecutor<Tour> {
    // JpaSpecificationExecutor sẽ cung cấp các phương thức
    // như findAll(Specification<Tour> spec, Pageable pageable)
    // cho phép chúng ta lọc động
    long countByTourDestinationsDestination(Destination destination);

    // (MỚI) Ghi đè findById để fetch tất cả dữ liệu cần thiết cho TourDetails
    // Điều này giúp tránh lỗi LazyInitializationException và N+1 query
    @Query("SELECT t FROM Tour t " +
            "LEFT JOIN FETCH t.tourType " +
            "LEFT JOIN FETCH t.reviews " +
            "LEFT JOIN FETCH t.tourDestinations td " +
            "LEFT JOIN FETCH td.destination " +
            "LEFT JOIN FETCH t.tourPromotions tp " +
            "LEFT JOIN FETCH tp.promotion " +
            "LEFT JOIN FETCH t.tourImages " +
            "LEFT JOIN FETCH t.itineraries " +
            "WHERE t.tourID = :id")
    @Override
    Optional<Tour> findById(@Param("id") String id);

    List<Tour> findByStatus(TourStatus status);

    List<Tour> findByTitleContainingIgnoreCase(String keyword);
}