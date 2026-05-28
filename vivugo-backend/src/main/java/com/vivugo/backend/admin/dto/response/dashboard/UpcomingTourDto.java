package com.vivugo.backend.admin.dto.response.dashboard;

import com.vivugo.backend.model.enums.TourStatus;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpcomingTourDto {
    private String tourId;
    private String tourName;
    private LocalDate departureDate;
    private Long bookedSeats;
    private Integer totalSeats;
    private Integer remainingSeats;
    private TourStatus status;
}
