package com.vivugo.backend.service;

import com.vivugo.backend.dto.ReviewDto;
import com.vivugo.backend.dto.ReviewRequest;
import com.vivugo.backend.exception.ConflictException;
import com.vivugo.backend.exception.ResourceNotFoundException;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.Review;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.User;
import com.vivugo.backend.model.enums.ReviewStatus;
import com.vivugo.backend.repository.ReviewRepository;
import com.vivugo.backend.repository.TourRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final TourRepository tourRepository;

    public ReviewService(ReviewRepository reviewRepository, TourRepository tourRepository) { // (CẬP NHẬT CONSTRUCTOR)
        this.reviewRepository = reviewRepository;
        this.tourRepository = tourRepository;
    }

    @Transactional(readOnly = true) // Đảm bảo chỉ đọc, tối ưu hiệu suất
    public Page<ReviewDto> getApprovedReviewsForTour(String tourId, int page, int size) {

        // (1) Tạo đối tượng Pageable, sắp xếp theo 'createdAt' mới nhất
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Review> reviewPage = reviewRepository.findReviewsByTourAndStatus(
                tourId,
                ReviewStatus.APPROVED,
                pageable
        );

        return reviewPage.map(ReviewDto::new);
    }

    @Transactional
    public void createReview(ReviewRequest request, Account currentUser) {
        User user = currentUser.getUser();

        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + request.getTourId()));

        if (reviewRepository.existsByUserAndTour(user, tour)) {
            throw new ConflictException("Bạn đã đánh giá tour này rồi.");
        }

        Review review = new Review();
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUser(user);
        review.setTour(tour);
        review.setStatus(ReviewStatus.APPROVED);

        reviewRepository.save(review);
    }

    /**
     * API kiểm tra xem User đã review Tour này chưa (dùng cho nút Review trên frontend).
     */
    @Transactional(readOnly = true)
    public boolean hasUserReviewedTour(String tourId, Account currentUser) {
        User user = currentUser.getUser();
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        return reviewRepository.existsByUserAndTour(user, tour);
    }
}