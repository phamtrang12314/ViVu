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
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ReviewService {
    private static final long MAX_MEDIA_SIZE_BYTES = 50L * 1024 * 1024;
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "webp", "avif",
            "mp4", "webm", "mov", "m4v"
    );

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
        review.setVideoUrl(normalizeAndValidateMediaUrl(request.getVideoUrl()));
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

    @Transactional
    public String uploadReviewMedia(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ConflictException("Vui long chon anh hoac video de tai len.");
        }
        if (file.getSize() > MAX_MEDIA_SIZE_BYTES) {
            throw new ConflictException("Dung luong toi da cho tep media la 50MB.");
        }

        String contentType = file.getContentType();
        boolean isImage = contentType != null && contentType.startsWith("image/");
        boolean isVideo = contentType != null && contentType.startsWith("video/");
        if (!isImage && !isVideo) {
            throw new ConflictException("Chi ho tro tep anh hoac video.");
        }

        String extension = extractExtension(file.getOriginalFilename());
        if (extension.isEmpty() || !ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ConflictException("Dinh dang tep khong duoc ho tro.");
        }

        Path uploadDir = Path.of("uploads", "images", "reviews");
        try {
            Files.createDirectories(uploadDir);
            String fileName = UUID.randomUUID() + "." + extension;
            Path target = uploadDir.resolve(fileName).normalize();
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return "/images/reviews/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Loi khi luu tep media review.", e);
        }
    }

    private String normalizeAndValidateMediaUrl(String rawUrl) {
        if (rawUrl == null) {
            return null;
        }

        String url = rawUrl.trim();
        if (url.isEmpty()) {
            return null;
        }

        if (url.startsWith("/images/reviews/")) {
            return url;
        }

        URI uri;
        try {
            uri = URI.create(url);
        } catch (IllegalArgumentException e) {
            throw new ConflictException("Duong dan media khong hop le.");
        }

        String scheme = uri.getScheme();
        if (scheme == null || (!"http".equalsIgnoreCase(scheme) && !"https".equalsIgnoreCase(scheme))) {
            throw new ConflictException("Link media phai bat dau bang http:// hoac https://.");
        }

        return url;
    }

    private String extractExtension(String originalFilename) {
        if (originalFilename == null) return "";
        int lastDot = originalFilename.lastIndexOf('.');
        if (lastDot < 0 || lastDot == originalFilename.length() - 1) return "";
        return originalFilename.substring(lastDot + 1).toLowerCase(Locale.ROOT);
    }
}
