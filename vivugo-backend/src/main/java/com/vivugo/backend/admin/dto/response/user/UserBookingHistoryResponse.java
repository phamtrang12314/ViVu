package com.vivugo.backend.admin.dto.response.user;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserBookingHistoryResponse {
    private String bookingID;
    private String tourName;
    private String date;
    private Double  amount;
    private String status;
}