package com.vivugo.backend.dto;

import com.vivugo.backend.model.Review;
import com.vivugo.backend.model.User;
import java.time.LocalDateTime;

public class ReviewDto {

    private int rating;
    private String comment;
    private String videoUrl;
    private LocalDateTime createdAt;
    private String adminReply;
    private LocalDateTime repliedAt;
    private String repliedBy;
    private ReviewUserDto user;

    public ReviewDto() {}

    public ReviewDto(Review review) {
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.videoUrl = review.getVideoUrl();
        this.createdAt = review.getCreatedAt();
        this.adminReply = review.getAdminReply();
        this.repliedAt = review.getRepliedAt();
        this.repliedBy = review.getRepliedBy();

        if (review.getUser() != null) {
            this.user = new ReviewUserDto(review.getUser());
        }
    }

    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public String getVideoUrl() { return videoUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getAdminReply() { return adminReply; }
    public LocalDateTime getRepliedAt() { return repliedAt; }
    public String getRepliedBy() { return repliedBy; }
    public ReviewUserDto getUser() { return user; }

    public static class ReviewUserDto {
        private String name;
        private String avatarURL;

        public ReviewUserDto() {}

        public ReviewUserDto(User user) {
            this.name = user.getName();
            this.avatarURL = user.getAvatarURL();
        }

        public String getName() { return name; }
        public String getAvatarURL() { return avatarURL; }
    }
}
