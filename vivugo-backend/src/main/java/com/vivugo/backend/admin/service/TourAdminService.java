package com.vivugo.backend.admin.service;

import com.vivugo.backend.admin.dto.request.ItineraryRequest;
import com.vivugo.backend.admin.dto.request.TourRequest;
import com.vivugo.backend.admin.dto.response.tour.TourAdminResponse;
import com.vivugo.backend.admin.dto.response.tour.TourDetailAdminResponse;
import com.vivugo.backend.admin.dto.response.tour.TourSimpleForParticipantsAdminResponse;
import com.vivugo.backend.admin.dto.response.tour.TourSimpleResponse;
import com.vivugo.backend.model.*;
import com.vivugo.backend.model.enums.BookingStatus;
import com.vivugo.backend.model.enums.TourStatus;
import com.vivugo.backend.repository.*;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.JoinType;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TourAdminService {

    private final TourRepository tourRepository;
    private final TourTypeRepository tourTypeRepository;
    private final DestinationRepository destinationRepository;
    private final TourDestinationRepository tourDestinationRepository;

    // NEW
    private final PromotionRepository promotionRepository;
    private final ItineraryRepository itineraryRepository;
    private final TourPromotionRepository tourPromotionRepository;

    public TourAdminService(TourRepository tourRepository, TourTypeRepository tourTypeRepository, DestinationRepository destinationRepository, TourDestinationRepository tourDestinationRepository, PromotionRepository promotionRepository, ItineraryRepository itineraryRepository, TourPromotionRepository tourPromotionRepository) {
        this.tourRepository = tourRepository;
        this.tourTypeRepository = tourTypeRepository;
        this.destinationRepository = destinationRepository;
        this.tourDestinationRepository = tourDestinationRepository;
        this.promotionRepository = promotionRepository;
        this.itineraryRepository = itineraryRepository;
        this.tourPromotionRepository = tourPromotionRepository;
    }

    public Page<TourAdminResponse> getAllTours(int page, int size, String search, String tourTypeId, String status) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Tour> spec = buildSpecification(search, tourTypeId, status);

        Page<Tour> tourPage = tourRepository.findAll(spec, pageable);
        return tourPage.map(TourAdminResponse::new);
    }

    private Specification<Tour> buildSpecification(String search, String tourTypeId, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // (1) Tìm kiếm theo tên
            if (search != null && !search.isEmpty()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("title")), pattern));
            }

            // (2) Lọc theo loại tour
            if (tourTypeId != null && !tourTypeId.isEmpty()) {
                Join<Tour, TourType> joinType = root.join("tourType", JoinType.LEFT);
                predicates.add(cb.equal(joinType.get("tourTypeID"), tourTypeId));
            }

            // (3) Lọc theo trạng thái
            if (status != null && !status.isEmpty()) {
                try {
                    TourStatus parsed = TourStatus.valueOf(status.toUpperCase());
                    predicates.add(cb.equal(root.get("status"), parsed));
                } catch (IllegalArgumentException e) {
                    // Nếu status không hợp lệ thì bỏ qua
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Transactional
    public Tour createTour(TourRequest dto) {
        Tour tour = new Tour();
        tour.setTitle(dto.getTitle());
        tour.setDescription(dto.getDescription());
        tour.setStartDate(dto.getStartDate());
        tour.setEndDate(dto.getEndDate());
        tour.setDurationDays(dto.getDurationDays());
        tour.setDurationNights(dto.getDurationNights());
        tour.setPriceAdult(dto.getPriceAdult());
        tour.setPriceChild(dto.getPriceChild());
        tour.setMinParticipants(dto.getMinGuests());
        tour.setMaxParticipants(dto.getMaxGuests());
        tour.setImageURL(dto.getImageURL());
        tour.setStatus(TourStatus.valueOf(dto.getStatus()));

        // tour type
        TourType tourType = tourTypeRepository.findById(dto.getTourTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid tourTypeId"));
        tour.setTourType(tourType);

        // lưu tour trước để có tourID
        Tour saved = tourRepository.save(tour);

        // ===== Điểm đến =====
        if (dto.getDestinationIds() != null) {
            for (String desId : dto.getDestinationIds()) {
                Destination des = destinationRepository.findById(desId)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid destinationId: " + desId));

                TourDestination td = new TourDestination();
                td.setTour(saved);
                td.setDestination(des);
                tourDestinationRepository.save(td);
            }
        }

        // ===== Khuyến mãi (TourPromotion) =====
        if (dto.getPromotionIds() != null) {
            for (String promoId : dto.getPromotionIds()) {
                Promotion promo = promotionRepository.findById(promoId)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid promotionId: " + promoId));

                TourPromotion tp = new TourPromotion();
                tp.setTour(saved);
                tp.setPromotion(promo);

                tourPromotionRepository.save(tp);
                saved.getTourPromotions().add(tp);
            }
        }

        // ===== Lịch trình (Itinerary) =====
        if (dto.getItineraries() != null) {
            int index = 1;
            for (ItineraryRequest itReq : dto.getItineraries()) {
                if (itReq.getTitle() == null || itReq.getTitle().isBlank()) continue;

                Itinerary it = new Itinerary();
                it.setTour(saved);
                it.setTitle(itReq.getTitle());
                it.setDescription(itReq.getDescription());
                it.setDayNumber(
                        itReq.getDayNumber() != null ? itReq.getDayNumber() : index
                );
                index++;

                itineraryRepository.save(it);
                saved.getItineraries().add(it);
            }
        }

        return saved;
    }

    public TourDetailAdminResponse getTourDetail(String id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));
        // đảm bảo load quan hệ nếu dùng LAZY (hoặc bật transactional)
        return new TourDetailAdminResponse(tour);
    }

@Transactional
public Tour updateTour(String id, TourRequest dto) {
    Tour tour = tourRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tour not found"));

    tour.setTitle(dto.getTitle());
    tour.setDescription(dto.getDescription());
    tour.setStartDate(dto.getStartDate());
    tour.setEndDate(dto.getEndDate());
    tour.setDurationDays(dto.getDurationDays());
    tour.setDurationNights(dto.getDurationNights());
    tour.setPriceAdult(dto.getPriceAdult());
    tour.setPriceChild(dto.getPriceChild());
    tour.setMinParticipants(dto.getMinGuests());
    tour.setMaxParticipants(dto.getMaxGuests());
    tour.setImageURL(dto.getImageURL());
    tour.setStatus(TourStatus.valueOf(dto.getStatus()));

    // tour type
    TourType tourType = tourTypeRepository.findById(dto.getTourTypeId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid tourTypeId"));
    tour.setTourType(tourType);

    // ===== Xóa & cập nhật TourDestination =====
    if (tour.getTourDestinations() != null) {
        tour.getTourDestinations().clear(); // orphanRemoval sẽ xóa
    }
    if (dto.getDestinationIds() != null) {
        for (String desId : dto.getDestinationIds()) {
            Destination des = destinationRepository.findById(desId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid destinationId: " + desId));

            TourDestination td = new TourDestination();
            td.setTour(tour);
            td.setDestination(des);
            tour.getTourDestinations().add(td);
        }
    }

    // ===== Xóa & cập nhật khuyến mãi (TourPromotion) =====
    if (tour.getTourPromotions() != null) {
        tour.getTourPromotions().clear(); // orphanRemoval
    }
    if (dto.getPromotionIds() != null) {
        for (String promoId : dto.getPromotionIds()) {
            Promotion promo = promotionRepository.findById(promoId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid promotionId: " + promoId));

            TourPromotion tp = new TourPromotion();
            tp.setTour(tour);
            tp.setPromotion(promo);
            tour.getTourPromotions().add(tp);
        }
    }

    // ===== Xóa & cập nhật lịch trình (Itinerary) =====
    if (tour.getItineraries() != null) {
        tour.getItineraries().clear(); // orphanRemoval
    }
    if (dto.getItineraries() != null) {
        int index = 1;
        for (ItineraryRequest itReq : dto.getItineraries()) {
            if (itReq.getTitle() == null || itReq.getTitle().isBlank()) continue;

            Itinerary it = new Itinerary();
            it.setTour(tour);
            it.setTitle(itReq.getTitle());
            it.setDescription(itReq.getDescription());
            it.setDayNumber(
                    itReq.getDayNumber() != null ? itReq.getDayNumber() : index
            );
            index++;

            tour.getItineraries().add(it);
        }
    }

    return tourRepository.save(tour);
}


    public List<TourSimpleResponse> getOpenToursSimple() {
        // Nếu status của bạn là ACTIVE thì đổi TourStatus.OPEN -> TourStatus.ACTIVE
        List<Tour> tours = tourRepository.findByStatus(TourStatus.ACTIVE);

        return tours.stream()
                .map(t -> new TourSimpleResponse(
                        t.getTourID(),
                        t.getTitle()
                ))
                .toList();
    }

    public List<TourSimpleResponse> getCompletedToursSimple() {
        List<Tour> tours = tourRepository.findByStatus(TourStatus.COMPLETED);

        return tours.stream()
                .map(t -> new TourSimpleResponse(
                        t.getTourID(),
                        t.getTitle()
                ))
                .toList();
    }

    public List<TourSimpleForParticipantsAdminResponse> searchToursForParticipants(String keyword) {
        String kw = (keyword == null) ? "" : keyword.trim();

        Specification<Tour> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // không lấy tour đã hủy
            predicates.add(cb.notEqual(root.get("status"), TourStatus.CANCELED));

            if (!kw.isBlank()) {
                String pattern = "%" + kw.toLowerCase() + "%";

                Predicate byTitle = cb.like(cb.lower(root.get("title")), pattern);

                // nếu có field code thì dùng, nếu không thì bỏ
                Predicate byCode = cb.like(cb.lower(root.get("code")), pattern);

                predicates.add(cb.or(byTitle, byCode));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Tour> tours = tourRepository.findAll(
                spec,
                Sort.by(Sort.Direction.DESC, "startDate")
        );

        return tours.stream()
                .map(TourSimpleForParticipantsAdminResponse::new)
                .toList();
    }

    @Transactional
    public void completeTour(String id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        // Cập nhật trạng thái tour
        tour.setStatus(TourStatus.COMPLETED);

        // Cập nhật các booking liên quan
        if (tour.getBookings() != null) {
            for (Booking booking : tour.getBookings()) {
                if (booking.getStatus() != BookingStatus.COMPLETED) {
                    booking.setStatus(BookingStatus.COMPLETED);
                }
            }
        }

        tourRepository.save(tour);
    }



}

