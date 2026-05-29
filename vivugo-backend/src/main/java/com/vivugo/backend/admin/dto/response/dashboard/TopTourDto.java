package com.vivugo.backend.admin.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopTourDto {
    private String tourName;
    private Long bookingCount;
    private Double totalRevenue;
}