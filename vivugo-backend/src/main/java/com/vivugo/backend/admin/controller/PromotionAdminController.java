package com.vivugo.backend.admin.controller;

import com.vivugo.backend.admin.dto.response.promotions.PromotionAdminResponse;
import com.vivugo.backend.admin.dto.request.PromotionRequest;
import com.vivugo.backend.admin.dto.response.promotions.PromotionSimpleResponse;
import com.vivugo.backend.admin.service.PromotionAdminService;
import com.vivugo.backend.model.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/promotions") // Đường dẫn API mới
public class PromotionAdminController {

    private final PromotionAdminService promotionAdminService;

    public PromotionAdminController(PromotionAdminService promotionAdminService) {
        this.promotionAdminService = promotionAdminService;
    }

    @GetMapping
    public ResponseEntity<Page<PromotionAdminResponse>> getAllPromotions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(name = "discountType", required = false) String discountType, // <--- ĐÃ THÊM
            @RequestParam(required = false) String sort
    ) {
        // Gọi service (cần cập nhật service trước)
        Page<PromotionAdminResponse> promotionPage = promotionAdminService.getAllPromotions(
                page, size, search, status, discountType, sort // <--- ĐÃ CẬP NHẬT
        );

        return ResponseEntity.ok(promotionPage);
    }

    // (MỚI) API TẠO KHUYẾN MÃI (POST)
    @PostMapping
    public ResponseEntity<PromotionAdminResponse> createPromotion(@RequestBody PromotionRequest request) {
        try {
            Promotion created = promotionAdminService.createPromotion(request);
            // Trả về 201 Created
            return ResponseEntity.status(HttpStatus.CREATED).body(new PromotionAdminResponse(created));
        } catch (IllegalArgumentException e) {
            // Trả về 400 Bad Request nếu logic nghiệp vụ bị vi phạm (ví dụ: mã trùng)
            return ResponseEntity.badRequest().build();
        }
    }

    // (MỚI) API CẬP NHẬT KHUYẾN MÃI (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<PromotionAdminResponse> updatePromotion(
            @PathVariable String id,
            @RequestBody PromotionRequest request) {
        try {
            Promotion updated = promotionAdminService.updatePromotion(id, request);
            return ResponseEntity.ok(new PromotionAdminResponse(updated));
        } catch (IllegalArgumentException e) {
            // Trả về 400 Bad Request nếu logic nghiệp vụ bị vi phạm
            return ResponseEntity.badRequest().build();
        }
        // ResourceNotFoundException sẽ tự động trả về 404 Not Found
    }
    @GetMapping("/{id}") // <--- ĐỊNH NGHĨA GET VỚI PARAM ID
    public ResponseEntity<PromotionAdminResponse> getPromotionDetail(@PathVariable String id) {
        // Gọi service để lấy chi tiết
        PromotionAdminResponse detail = promotionAdminService.getPromotionDetailById(id);

        // ResourceNotFoundException sẽ tự động trả về 404
        return ResponseEntity.ok(detail);
    }

    @GetMapping("/simple")
    public ResponseEntity<List<PromotionSimpleResponse>> getSimple() {
        return ResponseEntity.ok(promotionAdminService.getActivePromotionsSimple());
    }
}