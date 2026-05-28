package com.vivugo.backend.controller;

import com.vivugo.backend.dto.ReviewDto;
import com.vivugo.backend.dto.ReviewRequest;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
// FIX LỖI: Đổi base path sang /api/reviews để tránh xung đột path và khớp với frontend POST
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // API lấy review cho trang chi tiết tour (Final Path: /api/reviews/tour/{tourId})
    // Phương thức GET list reviews của bạn đã bị lỗi ở đây do xung đột path cũ.
    @GetMapping("/tour/{tourId}")
    public ResponseEntity<Page<ReviewDto>> getReviewsForTour(
            @PathVariable String tourId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<ReviewDto> reviewPage = reviewService.getApprovedReviewsForTour(tourId, page, size);
        return ResponseEntity.ok(reviewPage);
    }

    /**
     * API TẠO REVIEW MỚI
     * Final Path: /api/reviews
     */
    @PostMapping
    public ResponseEntity<?> createReview(
            @RequestBody ReviewRequest request,
            @AuthenticationPrincipal Account currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            reviewService.createReview(request, currentUser);
            return ResponseEntity.status(HttpStatus.CREATED).body("Đánh giá của bạn đã được gửi và đang chờ duyệt.");
        } catch (Exception e) {
            if (e.getMessage().contains("đã đánh giá")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
            } else if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            } else {
                return ResponseEntity.internalServerError().body("Lỗi server: " + e.getMessage());
            }
        }
    }

    /**
     * API KIỂM TRA ĐÃ REVIEW CHƯA
     * Final Path: /api/reviews/tour/{tourId}/reviewed
     */
    @GetMapping("/tour/{tourId}/reviewed")
    public ResponseEntity<Boolean> checkReviewed(
            @PathVariable String tourId,
            @AuthenticationPrincipal Account currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.ok(false);
        }
        boolean reviewed = reviewService.hasUserReviewedTour(tourId, currentUser);
        return ResponseEntity.ok(reviewed);
    }
}