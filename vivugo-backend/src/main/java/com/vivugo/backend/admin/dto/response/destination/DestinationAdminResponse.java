package com.vivugo.backend.admin.dto.response.destination;

import com.vivugo.backend.model.Destination;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Data
@NoArgsConstructor
public class DestinationAdminResponse {
    private String destinationID;
    private String nameDes;
    private String region;
    private String location;
    private String country;
    private String imageUrl;

    public DestinationAdminResponse(Destination destination) {
        this.destinationID = destination.getDestinationID();
        this.nameDes = destination.getNameDes();
        this.region = destination.getRegion();
        this.location = destination.getLocation();
        this.country = destination.getCountry();

        if (destination.getImages() != null && !destination.getImages().isEmpty()) {
            this.imageUrl = destination.getImages().get(0).getUrl();
        }
    }

}
