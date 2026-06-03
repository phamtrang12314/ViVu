package com.vivugo.backend.dto;

import com.vivugo.backend.model.Itinerary;

public class ItineraryDto {
    private int dayNumber;
    private String title;
    private String description;

    // Constructor để chuyển đổi
    public ItineraryDto(Itinerary itinerary) {
        this.dayNumber = itinerary.getDayNumber();
        this.title = itinerary.getTitle();
        this.description = itinerary.getDescription();
    }
    public ItineraryDto() {
    }

    // Getters
    public int getDayNumber() { return dayNumber; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
}