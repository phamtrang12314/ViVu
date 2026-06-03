package com.vivugo.backend.dto;

import com.vivugo.backend.model.Promotion;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.TourDestination;
import com.vivugo.backend.model.TourPromotion;
import com.vivugo.backend.model.enums.PromotionStatus;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class TourDetailsResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String tourID;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private int durationDays;
    private int durationNights;
    private String departurePlace;
    private Double priceAdult;
    private Double priceChild;
    private Double finalPriceAdult;
    private Double finalPriceChild;
    private int maxParticipants;
    private String imageURL;
    private String reviewVideoUrl;
    private String status;
    private Integer ranking;
    private TourTypeDto tourType;
    private List<DestinationDto> destinations;
    private List<TourImageDto> tourImages;
    private List<ItineraryDto> itineraries;
    private List<LocalDate> openDates;

    public TourDetailsResponse() {
    }

    public static TourDetailsResponse build(Tour tour) {
        TourDetailsResponse response = new TourDetailsResponse();
        response.setTourID(tour.getTourID());
        response.setTitle(tour.getTitle());
        response.setDescription(tour.getDescription());
        response.setStartDate(tour.getStartDate());
        response.setEndDate(tour.getEndDate());
        response.setDurationDays(tour.getDurationDays());
        response.setDurationNights(tour.getDurationNights());
        response.setDeparturePlace(tour.getDeparturePlace());
        response.setPriceAdult(tour.getPriceAdult());
        response.setPriceChild(tour.getPriceChild());
        response.setMaxParticipants(tour.getMaxParticipants());
        response.setImageURL(tour.getImageURL());
        response.setReviewVideoUrl(tour.getReviewVideoUrl());
        response.setStatus(tour.getStatus() == null ? null : tour.getStatus().name());
        response.setRanking(tour.getRanking());

        double discountPercentage = 0;
        LocalDate today = LocalDate.now();

        Optional<Promotion> bestPromotion = tour.getTourPromotions().stream()
                .map(TourPromotion::getPromotion)
                .filter(p -> p != null
                        && p.getStatus() == PromotionStatus.ACTIVE
                        && p.getStartDate() != null
                        && p.getEndDate() != null
                        && !today.isBefore(p.getStartDate())
                        && !today.isAfter(p.getEndDate()))
                .max(Comparator.comparingDouble(Promotion::getDiscountPercentage));

        if (bestPromotion.isPresent()) {
            discountPercentage = bestPromotion.get().getDiscountPercentage();
        }

        double adultPrice = tour.getPriceAdult() == null ? 0.0 : tour.getPriceAdult();
        double childPrice = tour.getPriceChild() == null ? 0.0 : tour.getPriceChild();
        double rawFinalAdult = adultPrice * (1 - (discountPercentage / 100.0));
        double rawFinalChild = childPrice * (1 - (discountPercentage / 100.0));
        response.setFinalPriceAdult(Math.ceil(rawFinalAdult / 10000.0) * 10000.0);
        response.setFinalPriceChild(Math.ceil(rawFinalChild / 10000.0) * 10000.0);

        if (tour.getTourType() != null) {
            response.setTourType(new TourTypeDto(tour.getTourType()));
        }

        response.setDestinations(
                tour.getTourDestinations().stream()
                        .map(TourDestination::getDestination)
                        .map(DestinationDto::new)
                        .toList()
        );

        response.setTourImages(
                tour.getTourImages().stream()
                        .sorted(Comparator.comparing(image -> image.getUrl() == null ? "" : image.getUrl()))
                        .map(TourImageDto::new)
                        .toList()
        );

        response.setItineraries(
                tour.getItineraries().stream()
                        .sorted(Comparator.comparingInt(it -> it.getDayNumber()))
                        .map(ItineraryDto::new)
                        .toList()
        );

        response.setOpenDates(tour.getOpenDates().stream().sorted().toList());
        return response;
    }

    public String getTourID() { return tourID; }
    public void setTourID(String tourID) { this.tourID = tourID; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public int getDurationDays() { return durationDays; }
    public void setDurationDays(int durationDays) { this.durationDays = durationDays; }
    public int getDurationNights() { return durationNights; }
    public void setDurationNights(int durationNights) { this.durationNights = durationNights; }
    public String getDeparturePlace() { return departurePlace; }
    public void setDeparturePlace(String departurePlace) { this.departurePlace = departurePlace; }
    public Double getPriceAdult() { return priceAdult; }
    public void setPriceAdult(Double priceAdult) { this.priceAdult = priceAdult; }
    public Double getPriceChild() { return priceChild; }
    public void setPriceChild(Double priceChild) { this.priceChild = priceChild; }
    public Double getFinalPriceAdult() { return finalPriceAdult; }
    public void setFinalPriceAdult(Double finalPriceAdult) { this.finalPriceAdult = finalPriceAdult; }
    public Double getFinalPriceChild() { return finalPriceChild; }
    public void setFinalPriceChild(Double finalPriceChild) { this.finalPriceChild = finalPriceChild; }
    public int getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(int maxParticipants) { this.maxParticipants = maxParticipants; }
    public String getImageURL() { return imageURL; }
    public void setImageURL(String imageURL) { this.imageURL = imageURL; }
    public String getReviewVideoUrl() { return reviewVideoUrl; }
    public void setReviewVideoUrl(String reviewVideoUrl) { this.reviewVideoUrl = reviewVideoUrl; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getRanking() { return ranking; }
    public void setRanking(Integer ranking) { this.ranking = ranking; }
    public TourTypeDto getTourType() { return tourType; }
    public void setTourType(TourTypeDto tourType) { this.tourType = tourType; }
    public List<DestinationDto> getDestinations() { return destinations; }
    public void setDestinations(List<DestinationDto> destinations) { this.destinations = destinations; }
    public List<TourImageDto> getTourImages() { return tourImages; }
    public void setTourImages(List<TourImageDto> tourImages) { this.tourImages = tourImages; }
    public List<ItineraryDto> getItineraries() { return itineraries; }
    public void setItineraries(List<ItineraryDto> itineraries) { this.itineraries = itineraries; }
    public List<LocalDate> getOpenDates() { return openDates; }
    public void setOpenDates(List<LocalDate> openDates) { this.openDates = openDates; }
}
