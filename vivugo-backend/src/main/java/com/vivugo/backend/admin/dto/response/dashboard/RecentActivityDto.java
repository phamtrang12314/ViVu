package com.vivugo.backend.admin.dto.response.dashboard;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecentActivityDto {
    private String type;
    private String title;
    private String description;
    private LocalDateTime happenedAt;
}
