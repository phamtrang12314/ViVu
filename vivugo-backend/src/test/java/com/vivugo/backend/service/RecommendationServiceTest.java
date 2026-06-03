package com.vivugo.backend.service;

import com.vivugo.backend.dto.RecommendationResponse;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.enums.TourStatus;
import com.vivugo.backend.repository.TourRepository;
import com.vivugo.backend.repository.TourViewEventRepository;
import java.util.List;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RecommendationServiceTest {

    @Test
    void returnsTopRankedToursWhenNoBehaviorHistory() {
        TourRepository tourRepository = mock(TourRepository.class);
        TourViewEventRepository eventRepository = mock(TourViewEventRepository.class);
        RecommendationService service = new RecommendationService(tourRepository, eventRepository);

        Tour highRankTour = buildTour("tour-1", "Ha Noi City Tour", 1, 1_000_000d);
        Tour lowRankTour = buildTour("tour-2", "Ha Long Bay Tour", 10, 1_500_000d);

        when(tourRepository.findByStatus(TourStatus.ACTIVE)).thenReturn(List.of(lowRankTour, highRankTour));

        RecommendationResponse response = service.getPersonalizedTours("session-1", null, 2);

        assertEquals(2, response.getTours().size());
        assertEquals("tour-1", response.getTours().get(0).getTourID());
        assertEquals("tour-2", response.getTours().get(1).getTourID());
    }

    private Tour buildTour(String id, String title, int ranking, double priceAdult) {
        Tour tour = new Tour();
        tour.setTourID(id);
        tour.setTitle(title);
        tour.setRanking(ranking);
        tour.setStatus(TourStatus.ACTIVE);
        tour.setPriceAdult(priceAdult);
        tour.setPriceChild(priceAdult / 2);
        tour.setDurationDays(2);
        tour.setDurationNights(1);
        return tour;
    }
}
