// src/main/java/com/tripbee/backend/admin/dto/PromotionAdminResponse.java
package com.vivugo.backend.admin.dto.response.promotions;

import com.vivugo.backend.model.Promotion;
import com.vivugo.backend.model.enums.PromotionStatus;
import java.time.LocalDate;

public class PromotionAdminResponse {
    private String promotionID;
    private String title;
    private double discountPercentage;
    private Double discountAmount;
    private int limitUsage;
    private int currentUsage;
    private LocalDate startDate;
    private LocalDate endDate;
    private PromotionStatus status;

    public PromotionAdminResponse(Promotion promotion) {
        this.promotionID = promotion.getPromotionID();
        this.title = promotion.getTitle();
        this.discountPercentage = promotion.getDiscountPercentage();
        this.discountAmount = promotion.getDiscountAmount();
        this.limitUsage = promotion.getLimitUsage();
        this.currentUsage = promotion.getCurrentUsage();
        this.startDate = promotion.getStartDate();
        this.endDate = promotion.getEndDate();
        this.status = promotion.getStatus();
    }

    // Getters (Bạn có thể bỏ qua phần này vì IDE sẽ tự tạo,
    // nhưng tôi sẽ giữ lại một số để đảm bảo tính đầy đủ)

    public String getPromotionID() { return promotionID; }
    public String getTitle() { return title; }
    public double getDiscountPercentage() { return discountPercentage; }
    public Double getDiscountAmount() { return discountAmount; }
    public int getLimitUsage() { return limitUsage; }
    public int getCurrentUsage() { return currentUsage; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public PromotionStatus getStatus() { return status; }
}