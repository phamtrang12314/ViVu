package com.vivugo.backend.admin.dto.request;

import lombok.Data;

@Data
public class UserCreateRequest {
    private String name;
    private String email;
    private String password;  // BẮT BUỘC: Admin nhập khi tạo user
    private String phoneNumber;
    private boolean locked;
}