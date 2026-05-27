package com.vivugo.backend.dto;

import com.vivugo.backend.model.Promotion;
import com.vivugo.backend.model.Review;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.TourDestination;
import com.vivugo.backend.model.TourPromotion;
import com.vivugo.backend.model.enums.PromotionStatus;
import com.vivugo.backend.model.enums.TourStatus;

import java.util.Optional;
import java.util.Set;

// DTO này dùng để hiển thị tour tóm tắt ngoài trang chủ
public class TourSummaryResponse {

    // --- Các trường giữ lại và trường mới ---
    private String tourID;
    private String title;
    private String imageURL; // Ảnh bìa
    private int durationDays;
    private int durationNights; // (Mới)
    private String destinationName; // (Mới - thay cho departurePlace)
    private Double priceAdult; // Giá gốc
    private Double finalPrice; // (Mới)
    private int discountPercentage; // (Mới)
    private double averageRating; // (Mới - thay cho ranking)
    private int reviewCount; // (Mới)
    private String tourTypeName; // (Mới)
    private TourStatus status;


    // Constructor để chuyển đổi từ Tour Entity sang DTO
    public TourSummaryResponse(Tour tour) {
        this.tourID = tour.getTourID();
        this.title = tour.getTitle();
        this.imageURL = tour.getImageURL();
        this.durationDays = tour.getDurationDays();
        this.durationNights = tour.getDurationNights(); // (Mới)
        this.priceAdult = tour.getPriceAdult();

        // (Mới) Lấy tên Tour Type
        if (tour.getTourType() != null) {
            this.tourTypeName = tour.getTourType().getNameType();
        }

        // (Mới) Lấy tên điểm đến đầu tiên
        if (tour.getTourDestinations() != null && !tour.getTourDestinations().isEmpty()) {
            // Sắp xếp hoặc tìm first() để đảm bảo tính nhất quán (nếu cần)
            Optional<TourDestination> firstDest = tour.getTourDestinations().stream().findFirst();
            if (firstDest.isPresent() && firstDest.get().getDestination() != null) {
                this.destinationName = firstDest.get().getDestination().getNameDes();
            }
        }

        // (Mới) Tính toán đánh giá
        Set<Review> reviews = tour.getReviews();
        if (reviews != null && !reviews.isEmpty()) {
            this.reviewCount = reviews.size();
            double sum = reviews.stream().mapToInt(Review::getRating).sum();
            // Làm tròn đến 1 chữ số thập phân
            this.averageRating = Math.round((sum / this.reviewCount) * 10.0) / 10.0;
        } else {
            this.reviewCount = 0;
            this.averageRating = 0.0;
        }

        // (Mới) Tìm khuyến mãi và tính toán giá cuối
        this.discountPercentage = 0;
        if (tour.getTourPromotions() != null && !tour.getTourPromotions().isEmpty()) {
            // Tìm khuyến mãi ACTIVE đầu tiên có giảm %
            Optional<Promotion> activePromo = tour.getTourPromotions().stream()
                    .map(TourPromotion::getPromotion)
                    .filter(p -> p != null &&
                            p.getStatus() == PromotionStatus.ACTIVE &&
                            p.getDiscountPercentage() > 0)
                    .findFirst();

            if (activePromo.isPresent()) {
                this.discountPercentage = activePromo.get().getDiscountPercentage();
            }
        }

        // (Mới) Tính finalPrice
        if (this.discountPercentage > 0 && this.priceAdult != null) {
            double discountAmount = this.priceAdult * (this.discountPercentage / 100.0);
            double discountedPrice = this.priceAdult - discountAmount;
            // Làm tròn LÊN đến 10.000 gần nhất
            this.finalPrice = Math.ceil(discountedPrice / 10000.0) * 10000.0;
        } else {
            this.finalPrice = this.priceAdult;
        }
    }

    // Thêm các getters thủ công
    public String getTourID() { return tourID; }
    public String getTitle() { return title; }
    public String getImageURL() { return imageURL; }
    public int getDurationDays() { return durationDays; }
    public int getDurationNights() { return durationNights; }
    public String getDestinationName() { return destinationName; }
    public Double getPriceAdult() { return priceAdult; }
    public Double getFinalPrice() { return finalPrice; }
    public int getDiscountPercentage() { return discountPercentage; }
    public double getAverageRating() { return averageRating; }
    public int getReviewCount() { return reviewCount; }
    public String getTourTypeName() { return tourTypeName; }
}