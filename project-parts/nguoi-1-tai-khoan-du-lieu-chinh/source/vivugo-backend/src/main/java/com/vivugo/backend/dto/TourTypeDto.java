package com.vivugo.backend.dto;

import com.vivugo.backend.model.TourType;

public class TourTypeDto {
    private String tourTypeID;
    private String nameType;

    public TourTypeDto() {
    }
    // Constructor (File này của bạn đã đúng)
    public TourTypeDto(TourType tourType) {
        this.tourTypeID = tourType.getTourTypeID();
        this.nameType = tourType.getNameType();
    }

    // Getters
    public String getTourTypeID() { return tourTypeID; }
    public String getNameType() { return nameType; }
}