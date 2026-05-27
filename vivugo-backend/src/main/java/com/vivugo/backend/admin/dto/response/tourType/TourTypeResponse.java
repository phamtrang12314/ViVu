package com.vivugo.backend.admin.dto.response.tourType;

import com.vivugo.backend.model.TourType;
import lombok.*;

@Data
@NoArgsConstructor
@Setter
@Getter
public class TourTypeResponse {
    private String tourTypeId;
    private String tourTypeName;

    public TourTypeResponse(TourType tourType) {
        this.tourTypeId = tourType.getTourTypeID();
        this.tourTypeName = tourType.getNameType();
    }
}
