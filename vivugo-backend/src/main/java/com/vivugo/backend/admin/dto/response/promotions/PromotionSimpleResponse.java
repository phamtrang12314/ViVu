package com.vivugo.backend.admin.dto.response.promotions;

import com.vivugo.backend.model.Promotion;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PromotionSimpleResponse {
    private String promotionID;
    private String title;
    private String status;

    public PromotionSimpleResponse(Promotion promotion) {
        this.promotionID = promotion.getPromotionID();
        this.title = promotion.getTitle();
        this.status = String.valueOf(promotion.getStatus());
    }
}
