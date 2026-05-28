// DestinationDetailAdminResponse.java
package com.vivugo.backend.admin.dto.response.destination;

import com.vivugo.backend.model.Destination;
import com.vivugo.backend.model.Image;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.TourDestination;
import com.vivugo.backend.model.enums.TourStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class DestinationDetailAdminResponse {
    private String destinationID;
    private String nameDes;
    private String region;
    private String location;
    private String country;
    private String description;
    private List<String> images;

    // Thống kê tour
    private int totalTours;          // tổng số tour sử dụng điểm đến này
    private int activeTours;         // tour đang hoạt động
    private int completedTours;      // tour đã hoàn thành
    private int upcomingTours;       // tour sắp khởi hành (startDate > hôm nay)
    private LocalDate lastUsedDate;  // ngày khởi hành gần nhất có tour dùng điểm đến này

    public DestinationDetailAdminResponse(Destination d) {
        this.destinationID = d.getDestinationID();
        this.nameDes = d.getNameDes();
        this.region = d.getRegion();
        this.location = d.getLocation();
        this.country = d.getCountry();

        if (d.getImages() != null && !d.getImages().isEmpty()) {
            this.images = d.getImages().stream()
                    .map(Image::getUrl)
                    .collect(Collectors.toList());
        } else {
            this.images = Collections.emptyList();
        }

        // Thống kê tour liên quan
        if (d.getTourDestinations() != null && !d.getTourDestinations().isEmpty()) {
            List<Tour> tours = d.getTourDestinations().stream()
                    .map(TourDestination::getTour)
                    .filter(Objects::nonNull)
                    .distinct()
                    .toList();

            this.totalTours = tours.size();
            this.activeTours = (int) tours.stream()
                    .filter(t -> t.getStatus() == TourStatus.ACTIVE)
                    .count();
            this.completedTours = (int) tours.stream()
                    .filter(t -> t.getStatus() == TourStatus.COMPLETED)
                    .count();

            LocalDate today = LocalDate.now();
            this.upcomingTours = (int) tours.stream()
                    .filter(t -> t.getStartDate() != null && t.getStartDate().isAfter(today))
                    .count();

            this.lastUsedDate = tours.stream()
                    .map(Tour::getStartDate)
                    .filter(Objects::nonNull)
                    .max(LocalDate::compareTo)
                    .orElse(null);
        } else {
            this.totalTours = 0;
            this.activeTours = 0;
            this.completedTours = 0;
            this.upcomingTours = 0;
            this.lastUsedDate = null;
        }
    }
}
