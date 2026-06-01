package com.vivugo.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.vivugo.backend.dto.TourDetailsResponse; // Cần để join
import com.vivugo.backend.dto.TourSummaryResponse; // Cần để join
import com.vivugo.backend.exception.ResourceNotFoundException; // Cần để join
import com.vivugo.backend.model.Destination;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.TourDestination;
import com.vivugo.backend.model.TourPromotion;
import com.vivugo.backend.model.TourType;
import com.vivugo.backend.model.enums.TourStatus;
import com.vivugo.backend.repository.TourRepository;

import jakarta.persistence.criteria.Fetch;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
@Service
public class TourService {

    private final TourRepository tourRepository;

    // (1) Dùng constructor để Spring tiêm (inject)
    public TourService(TourRepository tourRepository) {
        this.tourRepository = tourRepository;
    }

    @Cacheable(cacheNames = "tour:active-page")
    public Page<TourSummaryResponse> getAllActiveTours(
            int page, int size, String sort,
            String search, String destinationId, String tourTypeId,
            Double priceMin, Double priceMax, String region,
            Boolean dealsOnly, Integer durationMin, Integer durationMax) {

        Pageable pageable = PageRequest.of(page, size, parseSort(sort));
        Specification<Tour> spec = buildSpecification(
                search, destinationId, tourTypeId, priceMin, priceMax, region,
                dealsOnly, durationMin, durationMax);

        // (4) Gọi Repository
        Page<Tour> tourPage = tourRepository.findAll(spec, pageable);

        // (5) Chuyển đổi Page<Tour> sang Page<TourSummaryResponse>
        // Constructor của TourSummaryResponse (đã sửa) sẽ lo việc tính toán
        return tourPage.map(TourSummaryResponse::new);
    }
    
    @Cacheable(cacheNames = "tour:detail", key = "#tourId")
    public TourDetailsResponse getTourDetails(String tourId) {
        // Tìm tour bằng ID, nếu không thấy thì ném lỗi 404
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        // --- SỬA LỖI TẠI ĐÂY ---
        // Thay vì gọi "new", chúng ta gọi phương thức static "build"
        return TourDetailsResponse.build(tour);
    }

    @Cacheable(cacheNames = "tour:trending", key = "#size")
    public List<TourSummaryResponse> getTrendingTours(int size) {
        Pageable pageable = PageRequest.of(0, size, Sort.by(Sort.Direction.ASC, "ranking"));
        Specification<Tour> spec = buildSpecification(
                null, null, null, null, null, null, null, null, null);
        return tourRepository.findAll(spec, pageable).map(TourSummaryResponse::new).getContent();
    }

    @Cacheable(cacheNames = "tour:deals", key = "#size")
    public List<TourSummaryResponse> getDealTours(int size) {
        Pageable pageable = PageRequest.of(0, size, Sort.by(Sort.Direction.DESC, "priceAdult"));
        Specification<Tour> spec = buildSpecification(
                null, null, null, null, null, null, true, null, null);
        return tourRepository.findAll(spec, pageable).map(TourSummaryResponse::new).getContent();
    }

    private Specification<Tour> buildSpecification(
            String search, String destinationId, String tourTypeId,
            Double priceMin, Double priceMax, String region,
            Boolean dealsOnly, Integer durationMin, Integer durationMax) {

        // Trả về một hàm lambda (Specification)
        return (root, query, criteriaBuilder) -> {

            // (MỚI) FIX N+1 QUERY
            // Chỉ thực hiện fetch join cho truy vấn chính, không phải cho truy vấn count(*)
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {

                // Dùng LEFT JOIN FETCH để lấy dữ liệu liên quan
                root.fetch("tourType", JoinType.LEFT);
                root.fetch("reviews", JoinType.LEFT);

                // Fetch destinations (quan hệ 2 cấp)
                Fetch<Tour, TourDestination> tourDestFetch = root.fetch("tourDestinations", JoinType.LEFT);
                tourDestFetch.fetch("destination", JoinType.LEFT);

                // Fetch promotions (quan hệ 2 cấp)
                Fetch<Tour, TourPromotion> tourPromoFetch = root.fetch("tourPromotions", JoinType.LEFT);
                tourPromoFetch.fetch("promotion", JoinType.LEFT);

                // (THÊM MỚI) Fetch các liên kết khác
                root.fetch("tourImages", JoinType.LEFT);
                root.fetch("itineraries", JoinType.LEFT);
                root.fetch("openDates", JoinType.LEFT);


                // Rất quan trọng: Tránh trùng lặp do join
                query.distinct(true);
            }
            // (KẾT THÚC FIX N+1)


            // Dùng List để chứa các điều kiện (Predicate)
            List<Predicate> predicates = new ArrayList<>();

            // (A) Điều kiện BẮT BUỘC: Chỉ lấy tour 'ACTIVE'
            predicates.add(criteriaBuilder.equal(root.get("status"), TourStatus.ACTIVE));

            // (B) Thêm điều kiện TÌM KIẾM (nếu có)
            if (search != null && !search.isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate titleLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern);
                Predicate descLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern);
                predicates.add(criteriaBuilder.or(titleLike, descLike)); // Tìm theo title HOẶC description
            }

            // (C) Thêm điều kiện LỌC THEO GIÁ (nếu có)
            if (priceMin != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("priceAdult"), priceMin));
            }
            if (priceMax != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("priceAdult"), priceMax));
            }

            // (D) Thêm điều kiện LỌC THEO LOẠI TOUR (nếu có)
            // Phải dùng 'join' chứ không phải 'fetch' cho mệnh đề WHERE
            if (tourTypeId != null) {
                Join<Tour, TourType> tourTypeJoin = root.join("tourType", JoinType.LEFT);
                predicates.add(criteriaBuilder.equal(tourTypeJoin.get("tourTypeID"), tourTypeId));
            }

            // (CẬP NHẬT) (E) & (G): Lọc theo ĐỊA ĐIỂM và VÙNG MIỀN
            // Chúng ta chỉ join 1 lần nếu có destinationId HOẶC region
            if (destinationId != null || (region != null && !region.isEmpty())) {
                Join<Tour, TourDestination> tourDestJoin = root.join("tourDestinations", JoinType.LEFT);
                Join<TourDestination, Destination> destJoin = tourDestJoin.join("destination", JoinType.LEFT);

                // (E) Thêm điều kiện LỌC THEO ĐỊA ĐIỂM (nếu có)
                if (destinationId != null) {
                    predicates.add(criteriaBuilder.equal(destJoin.get("destinationID"), destinationId));
                }

                // (G) Thêm điều kiện LỌC THEO VÙNG MIỀN (nếu có)
                if (region != null && !region.isEmpty()) {
                    predicates.add(criteriaBuilder.equal(destJoin.get("region"), region));
                }
            }

            if (Boolean.TRUE.equals(dealsOnly)) {
                Join<Tour, TourPromotion> promoJoin = root.join("tourPromotions", JoinType.INNER);
                Join<TourPromotion, com.vivugo.backend.model.Promotion> promotionJoin =
                        promoJoin.join("promotion", JoinType.INNER);
                predicates.add(criteriaBuilder.equal(
                        promotionJoin.get("status"), com.vivugo.backend.model.enums.PromotionStatus.ACTIVE));
                predicates.add(criteriaBuilder.greaterThan(promotionJoin.get("discountPercentage"), 0));
            }

            if (durationMin != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("durationDays"), durationMin));
            }
            if (durationMax != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("durationDays"), durationMax));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    // (6) Hàm hỗ trợ chuyển đổi chuỗi sort (ví dụ: "price,asc") sang đối tượng Sort
    private Sort parseSort(String sort) {
        if (sort == null || sort.isEmpty()) {
            return Sort.by(Sort.Direction.ASC, "ranking"); // Mặc định sắp xếp theo ranking
        }
        try {
            String[] parts = sort.split(",");
            String property = parts[0];
            Sort.Direction direction = (parts.length > 1 && parts[1].equalsIgnoreCase("desc"))
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            return Sort.by(direction, property);
        } catch (Exception e) {
            return Sort.by(Sort.Direction.ASC, "ranking"); // Nếu chuỗi sort bị lỗi, dùng mặc định
        }
    }




}
