package com.vivugo.backend.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.vivugo.backend.model.Promotion;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.TourDestination; // Import enum PromotionStatus
import com.vivugo.backend.model.TourPromotion;
import com.vivugo.backend.model.enums.PromotionStatus;

public class TourDetailsResponse implements Serializable  {
private static final long serialVersionUID = 1L;
    private String tourID;
    private String title;
    private String description;
    private LocalDate startDate; // Sửa: Date -> LocalDate
    private LocalDate endDate; // Sửa: Date -> LocalDate
    private int durationDays;
    private int durationNights;
    private String departurePlace;
    private Double priceAdult; // Sửa: BigDecimal -> Double
    private Double priceChild; // Sửa: BigDecimal -> Double
    private Double finalPriceAdult; // <-- (MỚI)
    private Double finalPriceChild; // <-- (MỚI)
    private int maxParticipants;
    private String imageURL;
    private String status;
    private Integer ranking; // Sửa: int -> Integer (để khớp với Tour.java)
    private TourTypeDto tourType;
    private List<DestinationDto> destinations;
    private List<TourImageDto> tourImages;
    private List<ItineraryDto> itineraries;

    // --- Constructor ---
    public TourDetailsResponse() {}

    // --- Phương thức Build (Nơi sửa lỗi) ---
    // (Đây là phương thức trong ảnh của bạn, đã được sửa)
    public static TourDetailsResponse build(Tour tour) {
        TourDetailsResponse response = new TourDetailsResponse();
        response.setTourID(tour.getTourID());
        response.setTitle(tour.getTitle());
        response.setDescription(tour.getDescription());
        response.setStartDate(tour.getStartDate()); // Đã khớp kiểu LocalDate
        response.setEndDate(tour.getEndDate()); // Đã khớp kiểu LocalDate
        response.setDurationDays(tour.getDurationDays());
        response.setDurationNights(tour.getDurationNights());
        response.setDeparturePlace(tour.getDeparturePlace());
        response.setPriceAdult(tour.getPriceAdult()); // Đã khớp kiểu Double
        response.setPriceChild(tour.getPriceChild()); // Đã khớp kiểu Double
        response.setMaxParticipants(tour.getMaxParticipants());
        response.setImageURL(tour.getImageURL());
        response.setStatus(tour.getStatus().name());
        response.setRanking(tour.getRanking());

        // --- (CẬP NHẬT) Logic tính giá khuyến mãi và làm tròn ---
        double discountPercentage = 0;
        LocalDate today = LocalDate.now();

        // Tìm khuyến mãi tốt nhất đang hoạt động
        Optional<Promotion> bestPromotion = tour.getTourPromotions().stream()
                .map(TourPromotion::getPromotion)
                // (CẬP NHẬT) Sửa lỗi: Gọi thẳng PromotionStatus.ACTIVE
                .filter(p -> p.getStatus() == PromotionStatus.ACTIVE &&
                        !today.isBefore(p.getStartDate()) &&
                        !today.isAfter(p.getEndDate()))
                .max(Comparator.comparingDouble(Promotion::getDiscountPercentage));

        if (bestPromotion.isPresent()) {
            discountPercentage = bestPromotion.get().getDiscountPercentage();
        }

        // Tính toán giá cuối cùng (kiểm tra null để tránh lỗi)
        double adultPrice = tour.getPriceAdult() != null ? tour.getPriceAdult() : 0.0;
        double childPrice = tour.getPriceChild() != null ? tour.getPriceChild() : 0.0;

        // Tính giá thô sau khi giảm giá
        double rawFinalAdult = adultPrice * (1 - (discountPercentage / 100.0));
        double rawFinalChild = childPrice * (1 - (discountPercentage / 100.0));

        // (CẬP NHẬT) Làm tròn LÊN đến hàng chục nghìn
        // Ví dụ: 2,135,000 -> 2,140,000
        // Ví dụ: 2,130,000 -> 2,130,000
        double finalAdult = Math.ceil(rawFinalAdult / 10000.0) * 10000.0;
        double finalChild = Math.ceil(rawFinalChild / 10000.0) * 10000.0;

        response.setFinalPriceAdult(finalAdult);
        response.setFinalPriceChild(finalChild);
        // --- (Kết thúc logic cập nhật) ---


        if (tour.getTourType() != null) {
            // SỬA LỖI 1: Gọi constructor đúng
            response.setTourType(new TourTypeDto(tour.getTourType()));
        }

        // SỬA LỖI 2 & 3:
        // Sử dụng constructor (Destination) -> new DestinationDto(Destination)
        List<DestinationDto> destinationDtos = tour.getTourDestinations().stream()
                .map(TourDestination::getDestination)
                .map(DestinationDto::new) // <-- Sửa: Gọi hàm khởi tạo DestinationDto(Destination)
                .collect(Collectors.toList());
        response.setDestinations(destinationDtos);

        // SỬA LỖI (Tương tự):
        // Sử dụng constructor (TourImage) -> new TourImageDto(TourImage)
        List<TourImageDto> tourImageDtos = tour.getTourImages().stream()
                .map(TourImageDto::new) // <-- Sửa: Gọi hàm khởi tạo TourImageDto(TourImage)
                .collect(Collectors.toList());
        response.setTourImages(tourImageDtos);

        // SỬA LỖI (Tương tự):
        // Sử dụng constructor (Itinerary) -> new ItineraryDto(Itinerary)
        List<ItineraryDto> itineraryDtos = tour.getItineraries().stream()
                .map(ItineraryDto::new) // <-- Sửa: Gọi hàm khởi tạo ItineraryDto(Itinerary)
                .collect(Collectors.toList());
        response.setItineraries(itineraryDtos);

        return response;
    }

    // --- Getters and Setters (Giữ nguyên) ---
    // (Lưu ý: getter/setter cho startDate, endDate, priceAdult, priceChild
    // cũng phải được cập nhật để dùng LocalDate và Double)

    public String getTourID() { return tourID; }
    public void setTourID(String tourID) { this.tourID = tourID; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getStartDate() { return startDate; } // Sửa
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; } // Sửa
    public LocalDate getEndDate() { return endDate; } // Sửa
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; } // Sửa
    public int getDurationDays() { return durationDays; }
    public void setDurationDays(int durationDays) { this.durationDays = durationDays; }
    public int getDurationNights() { return durationNights; }
    public void setDurationNights(int durationNights) { this.durationNights = durationNights; }
    public String getDeparturePlace() { return departurePlace; }
    public void setDeparturePlace(String departurePlace) { this.departurePlace = departurePlace; }
    public Double getPriceAdult() { return priceAdult; } // Sửa
    public void setPriceAdult(Double priceAdult) { this.priceAdult = priceAdult; } // Sửa
    public Double getPriceChild() { return priceChild; } // Sửa
    public void setPriceChild(Double priceChild) { this.priceChild = priceChild; } // Sửa

    // (MỚI) Getters/Setters cho giá cuối cùng
    public Double getFinalPriceAdult() { return finalPriceAdult; }
    public void setFinalPriceAdult(Double finalPriceAdult) { this.finalPriceAdult = finalPriceAdult; }
    public Double getFinalPriceChild() { return finalPriceChild; }
    public void setFinalPriceChild(Double finalPriceChild) { this.finalPriceChild = finalPriceChild; }

    public int getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(int maxParticipants) { this.maxParticipants = maxParticipants; }
    public String getImageURL() { return imageURL; }
    public void setImageURL(String imageURL) { this.imageURL = imageURL; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getRanking() { return ranking; } // Sửa
    public void setRanking(Integer ranking) { this.ranking = ranking; } // Sửa
    public TourTypeDto getTourType() { return tourType; }
    public void setTourType(TourTypeDto tourType) { this.tourType = tourType; }
    public List<DestinationDto> getDestinations() { return destinations; }
    public void setDestinations(List<DestinationDto> destinations) { this.destinations = destinations; }
    public List<TourImageDto> getTourImages() { return tourImages; }
    public void setTourImages(List<TourImageDto> tourImages) { this.tourImages = tourImages; }
    public List<ItineraryDto> getItineraries() { return itineraries; }
    public void setItineraries(List<ItineraryDto> itineraries) { this.itineraries = itineraries; }
}