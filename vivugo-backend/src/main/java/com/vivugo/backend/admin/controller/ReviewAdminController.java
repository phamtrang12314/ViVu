package com.vivugo.backend.admin.controller;

import com.vivugo.backend.admin.dto.request.ReviewReplyRequest;
import com.vivugo.backend.admin.dto.request.ReviewStatusRequest;
import com.vivugo.backend.admin.dto.response.review.ReviewAdminResponse;
import com.vivugo.backend.admin.service.ReviewAdminService;
import com.vivugo.backend.model.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class ReviewAdminController {

    private final ReviewAdminService reviewAdminService;

    @GetMapping
    public ResponseEntity<Page<ReviewAdminResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(reviewAdminService.getAllReviews(page, size, status));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable String id,
            @RequestBody ReviewStatusRequest request
    ) {
        reviewAdminService.updateStatus(id, request);
        return ResponseEntity.ok("Cập nhật trạng thái review thành công");
    }

    @PatchMapping("/{id}/reply")
    public ResponseEntity<String> replyReview(
            @PathVariable String id,
            @RequestBody ReviewReplyRequest request,
            @AuthenticationPrincipal Account currentAdmin
    ) {
        String adminName = currentAdmin != null ? currentAdmin.getUsername() : "Admin";
        reviewAdminService.replyReview(id, request, adminName);
        return ResponseEntity.ok("Phản hồi đánh giá thành công");
    }
}

