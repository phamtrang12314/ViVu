package com.vivugo.backend.admin.service;

import com.vivugo.backend.admin.dto.request.ReviewStatusRequest;
import com.vivugo.backend.admin.dto.request.ReviewReplyRequest;
import com.vivugo.backend.admin.dto.response.review.ReviewAdminResponse;
import com.vivugo.backend.exception.ResourceNotFoundException;
import com.vivugo.backend.model.Review;
import com.vivugo.backend.model.enums.ReviewStatus;
import com.vivugo.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReviewAdminService {

    private final ReviewRepository reviewRepository;

    // Lấy tất cả review (lọc theo status)
    public Page<ReviewAdminResponse> getAllReviews(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Review> result;

        if (status == null || status.isEmpty()) {
            result = reviewRepository.findAll(pageable);
        } else {
            ReviewStatus st = ReviewStatus.valueOf(status.toUpperCase());
            result = reviewRepository.findByStatus(st, pageable);
        }

        return result.map(ReviewAdminResponse::new);
    }

    // Duyệt / Ẩn review
    public void updateStatus(String reviewId, ReviewStatusRequest request) {
        Review r = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        ReviewStatus newStatus = ReviewStatus.valueOf(request.getStatus().toUpperCase());

        r.setStatus(newStatus);
        reviewRepository.save(r);
    }

    public void replyReview(String reviewId, ReviewReplyRequest request, String adminName) {
        Review r = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (request.getReply() == null || request.getReply().isBlank()) {
            throw new IllegalArgumentException("Nội dung phản hồi không được để trống.");
        }

        r.setAdminReply(request.getReply().trim());
        r.setRepliedAt(LocalDateTime.now());
        r.setRepliedBy(adminName == null || adminName.isBlank() ? "Admin" : adminName.trim());
        reviewRepository.save(r);
    }
}
