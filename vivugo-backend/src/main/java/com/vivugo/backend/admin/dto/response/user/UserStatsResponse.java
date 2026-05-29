package com.vivugo.backend.admin.dto.response.user;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserStatsResponse {
    private long totalBookings;
    private long completedBookings;
    private long cancelledBookings;
    private Double  totalSpend; // tổng tiền đã chi
}