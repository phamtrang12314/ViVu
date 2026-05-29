package com.vivugo.backend.admin.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserUpdateRequest {
    private String name;
    private String phoneNumber;
    private boolean locked;
}