// src/main/java/com/tripbee/backend/admin/dto/request/DestinationAdminRequest.java
package com.vivugo.backend.admin.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class DestinationRequest {
    private String nameDes;
    private String region;
    private String location;
    private String country;
    private List<String> imageUrls;
}
