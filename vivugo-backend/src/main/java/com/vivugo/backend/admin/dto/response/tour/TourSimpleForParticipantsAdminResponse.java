package com.vivugo.backend.admin.dto.response.tour;


import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.enums.TourStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class TourSimpleForParticipantsAdminResponse {
    private String tourId;
    private String code;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private TourStatus status;

    public TourSimpleForParticipantsAdminResponse(Tour tour) {
        this.tourId = tour.getTourID();
        this.title = tour.getTitle();
        this.startDate = tour.getStartDate();
        this.endDate = tour.getEndDate();
        this.status = tour.getStatus();
    }


}
