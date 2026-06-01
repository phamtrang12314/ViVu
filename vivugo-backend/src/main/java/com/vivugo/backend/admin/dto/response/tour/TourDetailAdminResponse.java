package com.vivugo.backend.admin.dto.response.tour;

import com.vivugo.backend.admin.dto.response.itinerary.ItineraryAdminResponse;
import com.vivugo.backend.admin.dto.response.promotions.PromotionSimpleResponse;
import com.vivugo.backend.model.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TourDetailAdminResponse {
    private String tourID;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private int durationDays;
    private int durationNights;
    private Double priceAdult;
    private Double priceChild;
    private int maxParticipants;
    private int minParticipants;
    private String imageURL;
    private String reviewVideoUrl;
    private String status;
    private Integer ranking;

    private TourTypeInfo tourType;
    private List<TourDestinationInfo> tourDestinations;
    private List<PromotionSimpleResponse> promotions;
    private List<ItineraryAdminResponse> itineraries;
    private List<TourImageInfo> tourImages;
    private List<LocalDate> openDates;


    public TourDetailAdminResponse(Tour tour) {
        this.tourID = tour.getTourID();
        this.title = tour.getTitle();
        this.description = tour.getDescription();
        this.startDate = tour.getStartDate();
        this.endDate = tour.getEndDate();
        this.durationDays = tour.getDurationDays();
        this.durationNights = tour.getDurationNights();
        this.priceAdult = tour.getPriceAdult();
        this.priceChild = tour.getPriceChild();
        this.maxParticipants = tour.getMaxParticipants();
        this.minParticipants = tour.getMinParticipants();
        this.imageURL = tour.getImageURL();
        this.reviewVideoUrl = tour.getReviewVideoUrl();
        this.status = tour.getStatus() != null ? tour.getStatus().name() : null;
        this.ranking = tour.getRanking();

        TourType tt = tour.getTourType();
        if (tt != null) {
            this.tourType = new TourTypeInfo(tt.getTourTypeID(), tt.getNameType());
        }

        if (tour.getTourDestinations() != null) {
            this.tourDestinations = tour.getTourDestinations().stream()
                    .map(TourDestinationInfo::new)
                    .collect(Collectors.toList());
        }

        if (tour.getTourPromotions() != null) {
            this.promotions = tour.getTourPromotions().stream()
                    .map(tp -> new PromotionSimpleResponse(tp.getPromotion()))
                    .collect(Collectors.toList());
        }

        // NEW: itineraries (sort theo dayNumber)
        if (tour.getItineraries() != null) {
            this.itineraries = tour.getItineraries().stream()
                    .sorted(Comparator.comparingInt(Itinerary::getDayNumber))
                    .map(ItineraryAdminResponse::new)
                    .collect(Collectors.toList());
        }

        if (tour.getTourImages() != null) {
            this.tourImages = tour.getTourImages().stream()
                    .map(TourImageInfo::new)
                    .collect(Collectors.toList());
        }

        if (tour.getOpenDates() != null) {
            this.openDates = tour.getOpenDates().stream()
                    .sorted()
                    .toList();
        }
    }

    @Data
    public static class TourTypeInfo {
        private String id;
        private String name;

        public TourTypeInfo(String id, String name) {
            this.id = id;
            this.name = name;
        }
    }

    @Data
    public static class TourDestinationInfo {
        private String tourDestinationID;
        private DestinationInfo destination;

        public TourDestinationInfo(TourDestination td) {
            this.tourDestinationID = td.getTourDestinationID();
            Destination d = td.getDestination();
            if (d != null) {
                this.destination = new DestinationInfo(
                        d.getDestinationID(),
                        d.getNameDes(),
                        d.getRegion()
                );
            }
        }
    }

    @Data
    public static class DestinationInfo {
        private String id;
        private String nameDes;
        private String region;

        public DestinationInfo(String id, String nameDes, String region) {
            this.id = id;
            this.nameDes = nameDes;
            this.region = region;
        }
    }

    @Data
    public static class TourImageInfo {
        private String url;
        private String caption;

        public TourImageInfo(TourImage image) {
            this.url = image.getUrl();
            this.caption = image.getCaption();
        }
    }
}
