package com.vivugo.backend.admin.dto.response.tourType;

import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.TourType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class TourTypeDetailAdminResponse {
    private String tourTypeID;
    private String nameType;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updateDate;
    private int totalTours;
    private List<String> tourTitles;

    public TourTypeDetailAdminResponse(TourType t) {
        this.tourTypeID = t.getTourTypeID();
        this.nameType = t.getNameType();
        this.description = t.getDescription();
        this.createdAt = t.getCreatedAt();
        this.updateDate = t.getUpdateDate();
        this.totalTours = (t.getTours() != null) ? t.getTours().size() : 0;
        this.tourTitles = (t.getTours() == null) ? List.of()
                : t.getTours().stream()
                .map(Tour::getTitle)
                .collect(Collectors.toList());
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdateDate() {
        return updateDate;
    }

    public int getTotalTours() {
        return totalTours;
    }

    public List<String> getTourTitles() {
        return tourTitles;
    }
}
