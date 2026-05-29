// src/main/java/com/tripbee/backend/admin/dto/response/DestinationAdminResponse.java
package com.vivugo.backend.admin.dto.response.destination;

import com.vivugo.backend.model.Destination;
import com.vivugo.backend.model.Image;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
public class DestinationSaveResponse {

    private String destinationID;
    private String nameDes;
    private String region;
    private String location;
    private String country;
    private List<String> images;

    public DestinationSaveResponse(Destination destination) {
        this.destinationID = destination.getDestinationID();
        this.nameDes = destination.getNameDes();
        this.region = destination.getRegion();
        this.location = destination.getLocation();
        this.country = destination.getCountry();

        if (destination.getImages() != null && !destination.getImages().isEmpty()) {
            this.images = destination.getImages()
                    .stream()
                    .map(Image::getUrl)
                    .toList();
        } else {
            this.images = Collections.emptyList();
        }
    }
}
