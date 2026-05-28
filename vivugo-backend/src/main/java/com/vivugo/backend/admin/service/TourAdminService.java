package com.vivugo.backend.admin.service;

import com.vivugo.backend.admin.dto.request.ItineraryRequest;
import com.vivugo.backend.admin.dto.request.TourRequest;
import com.vivugo.backend.admin.dto.response.tour.TourAdminResponse;
import com.vivugo.backend.admin.dto.response.tour.TourDetailAdminResponse;
import com.vivugo.backend.admin.dto.response.tour.TourSimpleForParticipantsAdminResponse;
import com.vivugo.backend.admin.dto.response.tour.TourSimpleResponse;
import com.vivugo.backend.model.Booking;
import com.vivugo.backend.model.Destination;
import com.vivugo.backend.model.Itinerary;
import com.vivugo.backend.model.Promotion;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.TourDestination;
import com.vivugo.backend.model.TourImage;
import com.vivugo.backend.model.TourPromotion;
import com.vivugo.backend.model.TourType;
import com.vivugo.backend.model.enums.BookingStatus;
import com.vivugo.backend.model.enums.TourStatus;
import com.vivugo.backend.repository.DestinationRepository;
import com.vivugo.backend.repository.PromotionRepository;
import com.vivugo.backend.repository.TourRepository;
import com.vivugo.backend.repository.TourTypeRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class TourAdminService {

    private static final double MIN_TOUR_PRICE = 10_000.0;

    private final TourRepository tourRepository;
    private final TourTypeRepository tourTypeRepository;
    private final DestinationRepository destinationRepository;
    private final PromotionRepository promotionRepository;

    public TourAdminService(
            TourRepository tourRepository,
            TourTypeRepository tourTypeRepository,
            DestinationRepository destinationRepository,
            PromotionRepository promotionRepository
    ) {
        this.tourRepository = tourRepository;
        this.tourTypeRepository = tourTypeRepository;
        this.destinationRepository = destinationRepository;
        this.promotionRepository = promotionRepository;
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

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase(Locale.ROOT) + "%";
                predicates.add(cb.like(cb.lower(root.get("title")), pattern));
            }

            if (tourTypeId != null && !tourTypeId.isBlank()) {
                Join<Tour, TourType> joinType = root.join("tourType", JoinType.LEFT);
                predicates.add(cb.equal(joinType.get("tourTypeID"), tourTypeId));
            }

            if (status != null && !status.isBlank()) {
                try {
                    TourStatus parsed = TourStatus.valueOf(status.toUpperCase(Locale.ROOT));
                    predicates.add(cb.equal(root.get("status"), parsed));
                } catch (IllegalArgumentException ignored) {
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Transactional
    public Tour createTour(TourRequest dto) {
        Tour tour = new Tour();
        applyCommonFields(tour, dto);
        syncDestinations(tour, dto.getDestinationIds());
        syncPromotions(tour, dto.getPromotionIds());
        syncItineraries(tour, dto.getItineraries());
        syncImages(tour, dto.getImageUrls());
        syncOpenDates(tour, dto.getOpenDates(), dto.getStartDate(), dto.getEndDate());
        return tourRepository.save(tour);
    }

    @Transactional
    public Tour updateTour(String id, TourRequest dto) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        applyCommonFields(tour, dto);
        syncDestinations(tour, dto.getDestinationIds());
        syncPromotions(tour, dto.getPromotionIds());
        syncItineraries(tour, dto.getItineraries());
        syncImages(tour, dto.getImageUrls());
        syncOpenDates(tour, dto.getOpenDates(), dto.getStartDate(), dto.getEndDate());
        return tourRepository.save(tour);
    }

    @Transactional
    public TourDetailAdminResponse getTourDetail(String id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));
        return new TourDetailAdminResponse(tour);
    }

    public List<TourSimpleResponse> getOpenToursSimple() {
        return tourRepository.findByStatus(TourStatus.ACTIVE)
                .stream()
                .map(t -> new TourSimpleResponse(t.getTourID(), t.getTitle()))
                .toList();
    }

    public List<TourSimpleResponse> getCompletedToursSimple() {
        return tourRepository.findByStatus(TourStatus.COMPLETED)
                .stream()
                .map(t -> new TourSimpleResponse(t.getTourID(), t.getTitle()))
                .toList();
    }

    public List<TourSimpleForParticipantsAdminResponse> searchToursForParticipants(String keyword) {
        String kw = keyword == null ? "" : keyword.trim();

        Specification<Tour> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.notEqual(root.get("status"), TourStatus.CANCELED));

            if (!kw.isBlank()) {
                String pattern = "%" + kw.toLowerCase(Locale.ROOT) + "%";
                Predicate byTitle = cb.like(cb.lower(root.get("title")), pattern);
                predicates.add(byTitle);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return tourRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "startDate"))
                .stream()
                .map(TourSimpleForParticipantsAdminResponse::new)
                .toList();
    }

    @Transactional
    public void completeTour(String id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        tour.setStatus(TourStatus.COMPLETED);
        if (tour.getBookings() != null) {
            for (Booking booking : tour.getBookings()) {
                if (booking.getStatus() != BookingStatus.COMPLETED) {
                    booking.setStatus(BookingStatus.COMPLETED);
                }
            }
        }
        tourRepository.save(tour);
    }

    @Transactional
    public void cancelTour(String id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));
        tour.setStatus(TourStatus.CANCELED);
        tourRepository.save(tour);
    }

    private void applyCommonFields(Tour tour, TourRequest dto) {
        validateTourPrices(dto);

        tour.setTitle(dto.getTitle() == null ? "" : dto.getTitle().trim());
        tour.setDescription(dto.getDescription() == null ? "" : dto.getDescription().trim());
        tour.setDurationDays(dto.getDurationDays());
        tour.setDurationNights(dto.getDurationNights());
        tour.setPriceAdult(dto.getPriceAdult());
        tour.setPriceChild(dto.getPriceChild());
        tour.setMinParticipants(dto.getMinGuests());
        tour.setMaxParticipants(dto.getMaxGuests());
        tour.setImageURL(dto.getImageURL());
        tour.setReviewVideoUrl(dto.getReviewVideoUrl() == null ? null : dto.getReviewVideoUrl().trim());
        tour.setStatus(TourStatus.valueOf(dto.getStatus().toUpperCase(Locale.ROOT)));

        TourType tourType = tourTypeRepository.findById(dto.getTourTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid tourTypeId"));
        tour.setTourType(tourType);
    }

    private void validateTourPrices(TourRequest dto) {
        if (dto.getPriceAdult() == null || dto.getPriceAdult() < MIN_TOUR_PRICE) {
            throw new IllegalArgumentException("Adult price must be at least 10000 VND");
        }
        if (dto.getPriceChild() == null || dto.getPriceChild() < MIN_TOUR_PRICE) {
            throw new IllegalArgumentException("Child price must be at least 10000 VND");
        }
    }

    private void syncDestinations(Tour tour, List<String> destinationIds) {
        if (tour.getTourDestinations() == null) {
            tour.setTourDestinations(new LinkedHashSet<>());
        } else {
            tour.getTourDestinations().clear();
        }

        String firstDestinationName = null;
        String selectedRegion = null;
        if (destinationIds != null) {
            for (String destinationId : destinationIds) {
                if (destinationId == null || destinationId.isBlank()) {
                    continue;
                }
                Destination destination = destinationRepository.findById(destinationId)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid destinationId: " + destinationId));
                String destinationRegion = normalizeRegion(destination.getRegion());
                if (destinationRegion.isBlank()) {
                    throw new IllegalArgumentException("Destination region is required: " + destinationId);
                }
                if (selectedRegion == null) {
                    selectedRegion = destinationRegion;
                } else if (!selectedRegion.equals(destinationRegion)) {
                    throw new IllegalArgumentException("All selected destinations must belong to the same region");
                }

                if (firstDestinationName == null) {
                    firstDestinationName = destination.getNameDes();
                }

                TourDestination td = new TourDestination();
                td.setTour(tour);
                td.setDestination(destination);
                tour.getTourDestinations().add(td);
            }
        }
        if (tour.getTourDestinations().isEmpty()) {
            throw new IllegalArgumentException("At least one destination is required");
        }
        tour.setDeparturePlace(firstDestinationName);
    }

    private String normalizeRegion(String region) {
        return region == null ? "" : region.trim().toLowerCase(Locale.ROOT);
    }

    private void syncPromotions(Tour tour, List<String> promotionIds) {
        if (tour.getTourPromotions() == null) {
            tour.setTourPromotions(new LinkedHashSet<>());
        } else {
            tour.getTourPromotions().clear();
        }

        if (promotionIds == null) {
            return;
        }

        Set<String> uniquePromotionIds = new LinkedHashSet<>(promotionIds);
        for (String promotionId : uniquePromotionIds) {
            if (promotionId == null || promotionId.isBlank()) {
                continue;
            }
            Promotion promotion = promotionRepository.findById(promotionId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid promotionId: " + promotionId));

            TourPromotion tp = new TourPromotion();
            tp.setTour(tour);
            tp.setPromotion(promotion);
            tour.getTourPromotions().add(tp);
        }
    }

    private void syncItineraries(Tour tour, List<ItineraryRequest> itineraries) {
        if (tour.getItineraries() == null) {
            tour.setItineraries(new LinkedHashSet<>());
        } else {
            tour.getItineraries().clear();
        }

        if (itineraries == null) {
            return;
        }

        int fallbackDay = 1;
        for (ItineraryRequest itReq : itineraries) {
            if (itReq == null) {
                continue;
            }
            if ((itReq.getTitle() == null || itReq.getTitle().isBlank())
                    && (itReq.getDescription() == null || itReq.getDescription().isBlank())) {
                continue;
            }

            Itinerary itinerary = new Itinerary();
            itinerary.setTour(tour);
            itinerary.setDayNumber(itReq.getDayNumber() != null ? itReq.getDayNumber() : fallbackDay);
            itinerary.setTitle(itReq.getTitle() == null ? "" : itReq.getTitle().trim());
            itinerary.setDescription(itReq.getDescription() == null ? "" : itReq.getDescription().trim());
            tour.getItineraries().add(itinerary);
            fallbackDay++;
        }
    }

    private void syncImages(Tour tour, List<String> imageUrls) {
        if (tour.getTourImages() == null) {
            tour.setTourImages(new LinkedHashSet<>());
        } else {
            tour.getTourImages().clear();
        }

        Set<String> uniqueImages = new LinkedHashSet<>();
        if (tour.getImageURL() != null && !tour.getImageURL().isBlank()) {
            uniqueImages.add(tour.getImageURL().trim());
        }
        if (imageUrls != null) {
            for (String imageUrl : imageUrls) {
                if (imageUrl != null && !imageUrl.isBlank()) {
                    uniqueImages.add(imageUrl.trim());
                }
            }
        }

        for (String url : uniqueImages) {
            TourImage image = new TourImage();
            image.setTour(tour);
            image.setUrl(url);
            tour.getTourImages().add(image);
        }
    }

    private void syncOpenDates(Tour tour, List<LocalDate> openDates, LocalDate startDate, LocalDate endDate) {
        Set<LocalDate> normalizedOpenDates = new LinkedHashSet<>();
        if (openDates != null) {
            for (LocalDate openDate : openDates) {
                if (openDate != null) {
                    normalizedOpenDates.add(openDate);
                }
            }
        }
        if (normalizedOpenDates.isEmpty() && startDate != null) {
            normalizedOpenDates.add(startDate);
        }

        if (tour.getOpenDates() == null) {
            tour.setOpenDates(new LinkedHashSet<>());
        } else {
            tour.getOpenDates().clear();
        }
        tour.getOpenDates().addAll(normalizedOpenDates);

        if (!normalizedOpenDates.isEmpty()) {
            List<LocalDate> sorted = normalizedOpenDates.stream().sorted(Comparator.naturalOrder()).toList();
            LocalDate minDate = sorted.get(0);
            LocalDate maxDate = sorted.get(sorted.size() - 1);
            tour.setStartDate(minDate);
            tour.setEndDate(endDate != null && !endDate.isBefore(minDate) ? endDate : maxDate);
            return;
        }

        if (startDate != null) {
            tour.setStartDate(startDate);
        }
        if (endDate != null) {
            tour.setEndDate(endDate);
        }
    }
}
