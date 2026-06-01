package com.vivugo.backend.admin.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PendingTasksDto {
    private Long bookingAwaitingConfirmation;
    private Long unrespondedMessages;
    private Long reviewsPendingApproval;
    private Long refundRequests;
    private Long toursNearlySoldOut;
    private Long total;
}
