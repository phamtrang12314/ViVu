package com.vivugo.backend.admin.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Data
@Getter
@Setter
public class TourRequest {
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private int durationDays;
    private int durationNights;
    private Double priceAdult;
    private Double priceChild;
    private int minGuests;
    private int maxGuests;
    private String imageURL;
    private String reviewVideoUrl;
    private String status;
    private String tourTypeId;
    private List<String> destinationIds;

    private List<String> promotionIds;
    private List<String> imageUrls;
    private List<LocalDate> openDates;
    private List<ItineraryRequest> itineraries;
}
