package com.vivugo.backend.dto;

import java.time.LocalDateTime;

import com.vivugo.backend.model.Review;
import com.vivugo.backend.model.User;

public class ReviewDto {

    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private ReviewUserDto user; // (1) Thông tin người dùng lồng bên trong

    // THÊM ĐOẠN NÀY VÀO CHO CLASS CHÍNH
    public ReviewDto() {
    }
    // Constructor để chuyển đổi từ Review Entity sang DTO
    public ReviewDto(Review review) {
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();

        // (2) Kiểm tra null và tạo DTO người dùng
        if (review.getUser() != null) {
            this.user = new ReviewUserDto(review.getUser());
        }
    }

    // --- Getters ---
    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public ReviewUserDto getUser() { return user; }


    // (3) LỚP LỒNG BÊN TRONG (Nested Class)
    // Dùng để chỉ hiển thị thông tin công khai của User
    private static class ReviewUserDto {
        private String name;
        private String avatarURL;
// THÊM ĐOẠN NÀY VÀO CHO CLASS LỒNG BÊN TRONG
        public ReviewUserDto() {
        }
        public ReviewUserDto(User user) {
            this.name = user.getName();
            this.avatarURL = user.getAvatarURL();
        }

        // Getters cho lớp lồng
        public String getName() { return name; }
        public String getAvatarURL() { return avatarURL; }
    }
}