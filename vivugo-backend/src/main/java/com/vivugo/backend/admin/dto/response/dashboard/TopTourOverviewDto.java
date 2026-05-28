package com.vivugo.backend.admin.dto.response.dashboard;

import com.vivugo.backend.model.enums.TourStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopTourOverviewDto {
    private String tourId;
    private String tourName;
    private String destination;
    private Long bookingCount;
    private Double totalRevenue;
    private TourStatus status;
}
