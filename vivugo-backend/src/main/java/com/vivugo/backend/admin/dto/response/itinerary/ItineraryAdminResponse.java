package com.vivugo.backend.admin.dto.response.itinerary;

import com.vivugo.backend.model.Itinerary;
import lombok.Data;

@Data
public class ItineraryAdminResponse {
    private String itineraryID;
    private Integer dayNumber;
    private String title;
    private String description;

    public ItineraryAdminResponse(Itinerary it) {
        this.itineraryID = it.getItineraryID();
        this.dayNumber = it.getDayNumber();
        this.title = it.getTitle();
        this.description = it.getDescription();
    }
}
