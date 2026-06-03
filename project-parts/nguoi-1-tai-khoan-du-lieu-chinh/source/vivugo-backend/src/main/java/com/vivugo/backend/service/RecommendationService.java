package com.vivugo.backend.service;

import com.vivugo.backend.dto.PreferenceProfileDto;
import com.vivugo.backend.dto.RecommendationResponse;
import com.vivugo.backend.dto.TourSummaryResponse;
import com.vivugo.backend.exception.ResourceNotFoundException;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.Destination;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.TourDestination;
import com.vivugo.backend.model.TourViewEvent;
import com.vivugo.backend.model.User;
import com.vivugo.backend.model.enums.TourStatus;
import com.vivugo.backend.repository.TourRepository;
import com.vivugo.backend.repository.TourViewEventRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

    private final TourRepository tourRepository;
    private final TourViewEventRepository tourViewEventRepository;

    public RecommendationService(TourRepository tourRepository, TourViewEventRepository tourViewEventRepository) {
        this.tourRepository = tourRepository;
        this.tourViewEventRepository = tourViewEventRepository;
    }

    @Transactional
    public void recordTourView(String tourId, String sessionId, Authentication authentication) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        TourViewEvent event = new TourViewEvent();
        event.setTour(tour);
        event.setSessionId(cleanSessionId(sessionId));
        event.setUser(resolveUser(authentication).orElse(null));
        event.setViewedRegion(firstRegion(tour).orElse(null));
        event.setViewedPrice(tour.getPriceAdult());
        tourViewEventRepository.save(event);
    }

    @Transactional
    public RecommendationResponse getPersonalizedTours(String sessionId, Authentication authentication, int size) {
        List<TourViewEvent> events = loadRecentEvents(sessionId, authentication);
        PreferenceProfileDto profile = buildProfile(events);
        List<Tour> recommendations = recommendTours(events, Math.max(1, Math.min(size, 12)));

        String reason = profile.isHasBehavior()
                ? "Goi y dua tren vung mien, loai tour va tam gia ban da xem gan day."
                : "Ban chua co lich su xem tour, he thong dang hien thi cac tour noi bat.";

        return new RecommendationResponse(
                reason,
                profile,
                recommendations.stream().map(TourSummaryResponse::new).toList()
        );
    }

    @Transactional
    public List<TourSummaryResponse> recommendForChat(String sessionId, Authentication authentication, int size) {
        return getPersonalizedTours(sessionId, authentication, size).getTours();
    }

    private List<TourViewEvent> loadRecentEvents(String sessionId, Authentication authentication) {
        Optional<User> user = resolveUser(authentication);
        if (user.isPresent()) {
            List<TourViewEvent> byUser = tourViewEventRepository.findTop50ByUser_UserIDOrderByViewedAtDesc(user.get().getUserID());
            if (!byUser.isEmpty()) {
                return byUser;
            }
        }

        String cleanedSessionId = cleanSessionId(sessionId);
        if (cleanedSessionId != null) {
            return tourViewEventRepository.findTop50BySessionIdOrderByViewedAtDesc(cleanedSessionId);
        }
        return List.of();
    }

    private PreferenceProfileDto buildProfile(List<TourViewEvent> events) {
        PreferenceProfileDto profile = new PreferenceProfileDto();
        profile.setHasBehavior(!events.isEmpty());

        Map<String, Long> regionCounts = events.stream()
                .map(TourViewEvent::getViewedRegion)
                .filter(value -> value != null && !value.isBlank())
                .collect(Collectors.groupingBy(value -> value, LinkedHashMap::new, Collectors.counting()));
        profile.setRegionCounts(regionCounts);

        Map<String, Long> tourTypeCounts = events.stream()
                .map(TourViewEvent::getTour)
                .filter(Objects::nonNull)
                .map(Tour::getTourType)
                .filter(Objects::nonNull)
                .map(type -> type.getNameType())
                .filter(value -> value != null && !value.isBlank())
                .collect(Collectors.groupingBy(value -> value, LinkedHashMap::new, Collectors.counting()));
        profile.setTourTypeCounts(tourTypeCounts);

        List<Double> prices = events.stream()
                .map(TourViewEvent::getViewedPrice)
                .filter(Objects::nonNull)
                .toList();
        profile.setMinViewedPrice(prices.stream().min(Double::compareTo).orElse(null));
        profile.setMaxViewedPrice(prices.stream().max(Double::compareTo).orElse(null));
        profile.setAverageViewedPrice(prices.isEmpty()
                ? null
                : prices.stream().mapToDouble(Double::doubleValue).average().orElse(0.0));

        profile.setViewedTourIds(events.stream()
                .map(TourViewEvent::getTour)
                .filter(Objects::nonNull)
                .map(Tour::getTourID)
                .distinct()
                .toList());
        return profile;
    }

    private List<Tour> recommendTours(List<TourViewEvent> events, int size) {
        List<Tour> activeTours = new ArrayList<>(tourRepository.findByStatus(TourStatus.ACTIVE));
        if (activeTours.isEmpty()) {
            return List.of();
        }

        if (events.isEmpty()) {
            return activeTours.stream()
                    .sorted(Comparator.comparing(this::safeRanking).thenComparing(Tour::getTitle))
                    .limit(size)
                    .toList();
        }

        PreferenceProfileDto profile = buildProfile(events);
        Set<String> viewedTourIds = profile.getViewedTourIds().stream().collect(Collectors.toSet());
        Map<String, Long> regionCounts = profile.getRegionCounts() == null ? Map.of() : profile.getRegionCounts();
        Map<String, Long> typeCounts = profile.getTourTypeCounts() == null ? Map.of() : profile.getTourTypeCounts();
        Double avgPrice = profile.getAverageViewedPrice();

        Map<Tour, Double> scores = new HashMap<>();
        for (Tour tour : activeTours) {
            double score = 0.0;
            if (viewedTourIds.contains(tour.getTourID())) {
                score -= 30.0;
            } else {
                score += 5.0;
            }

            for (String region : allRegions(tour)) {
                score += regionCounts.getOrDefault(region, 0L) * 12.0;
            }

            if (tour.getTourType() != null && tour.getTourType().getNameType() != null) {
                score += typeCounts.getOrDefault(tour.getTourType().getNameType(), 0L) * 8.0;
            }

            if (avgPrice != null && tour.getPriceAdult() != null && avgPrice > 0) {
                double distanceRatio = Math.abs(tour.getPriceAdult() - avgPrice) / avgPrice;
                score += Math.max(0.0, 20.0 - distanceRatio * 20.0);
            }

            score += Math.max(0, 20 - safeRanking(tour)) * 0.5;
            scores.put(tour, score);
        }

        return activeTours.stream()
                .sorted(Comparator
                        .comparing((Tour tour) -> scores.getOrDefault(tour, 0.0)).reversed()
                        .thenComparing(this::safeRanking)
                        .thenComparing(Tour::getTitle))
                .limit(size)
                .toList();
    }

    private Optional<User> resolveUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return Optional.empty();
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof Account account && account.getUser() != null) {
            return Optional.of(account.getUser());
        }
        return Optional.empty();
    }

    private Optional<String> firstRegion(Tour tour) {
        return allRegions(tour).stream().findFirst();
    }

    private List<String> allRegions(Tour tour) {
        if (tour.getTourDestinations() == null) {
            return List.of();
        }
        return tour.getTourDestinations().stream()
                .map(TourDestination::getDestination)
                .filter(Objects::nonNull)
                .map(Destination::getRegion)
                .filter(value -> value != null && !value.isBlank())
                .distinct()
                .toList();
    }

    private String cleanSessionId(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            return null;
        }
        return sessionId.trim().length() > 120 ? sessionId.trim().substring(0, 120) : sessionId.trim();
    }

    private int safeRanking(Tour tour) {
        return tour.getRanking() == null ? 9999 : tour.getRanking();
    }
}
