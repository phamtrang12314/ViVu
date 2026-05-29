package com.vivugo.backend.admin.dto.response.user;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserDetailResponse {
    private String userID;
    private String name;
    private String email;
    private String phoneNumber;
    private String role;
    private boolean locked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
