package com.vivugo.backend.controller;

import com.vivugo.backend.dto.ReviewDto;
import com.vivugo.backend.dto.ReviewRequest;
import com.vivugo.backend.exception.ConflictException;
import com.vivugo.backend.exception.ResourceNotFoundException;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<Page<ReviewDto>> getReviewsForTour(
            @PathVariable String tourId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<ReviewDto> reviewPage = reviewService.getApprovedReviewsForTour(tourId, page, size);
        return ResponseEntity.ok(reviewPage);
    }

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
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Danh gia cua ban da duoc gui va dang cho duyet.");
        } catch (ConflictException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Loi server: " + e.getMessage());
        }
    }

    @PostMapping("/media")
    public ResponseEntity<?> uploadReviewMedia(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal Account currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String url = reviewService.uploadReviewMedia(file);
            return ResponseEntity.ok(new MediaUploadResponse(url));
        } catch (ConflictException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Loi server: " + e.getMessage());
        }
    }

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

    public record MediaUploadResponse(String url) {}
}
