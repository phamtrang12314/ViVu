package com.vivugo.backend.admin.dto.response.tourType;

import com.vivugo.backend.model.TourType;

public class TourTypeAdminResponse {
    private String tourTypeID;
    private String nameType;
    private String description;
    private int totalTours;

    public TourTypeAdminResponse(TourType t) {
        this.tourTypeID = t.getTourTypeID();
        this.nameType = t.getNameType();
        this.description = t.getDescription();
        this.totalTours = (t.getTours() != null) ? t.getTours().size() : 0;
    }

    public String getTourTypeID() {
        return tourTypeID;
    }

    public String getNameType() {
        return nameType;
    }

    public String getDescription() {
        return description;
    }

    public int getTotalTours() {
        return totalTours;
    }
}
