package com.vivugo.backend.admin.dto.response.review;

import com.vivugo.backend.model.Review;
import lombok.Data;

@Data
public class ReviewAdminResponse {

    private String reviewID;
    private String userName;
    private String userEmail;
    private String tourTitle;
    private int rating;
    private String comment;
    private String videoUrl;
    private String createdAt;
    private String status;
    private String adminReply;
    private String repliedAt;
    private String repliedBy;

    public ReviewAdminResponse(Review r) {
        this.reviewID = r.getReviewID();
        this.rating = r.getRating();
        this.comment = r.getComment();
        this.videoUrl = r.getVideoUrl();
        this.createdAt = r.getCreatedAt().toString();
        this.status = r.getStatus().name();
        this.adminReply = r.getAdminReply();
        this.repliedAt = r.getRepliedAt() != null ? r.getRepliedAt().toString() : null;
        this.repliedBy = r.getRepliedBy();

        if (r.getUser() != null) {
            this.userName = r.getUser().getName();
            this.userEmail = r.getUser().getEmail();
        }

        if (r.getTour() != null) {
            this.tourTitle = r.getTour().getTitle();
        }
    }
}
