package com.vivugo.backend.admin.dto.response.booking;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BookingStatsResponse {
    private long total;
    private long processing;
    private long confirmed;
    private long completed;
    private long canceled;
}
