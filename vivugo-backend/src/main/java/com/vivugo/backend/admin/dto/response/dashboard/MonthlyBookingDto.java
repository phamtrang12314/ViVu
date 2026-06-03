package com.vivugo.backend.admin.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyBookingDto {
    private Integer month;
    private Long bookings;
}
