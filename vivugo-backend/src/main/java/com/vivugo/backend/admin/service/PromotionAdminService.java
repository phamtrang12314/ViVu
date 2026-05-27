// src/main/java/com/tripbee/backend/admin/service/PromotionAdminService.java
package com.vivugo.backend.admin.service;

import com.vivugo.backend.admin.dto.response.promotions.PromotionAdminResponse;
import com.vivugo.backend.admin.dto.request.PromotionRequest;
import com.vivugo.backend.admin.dto.response.promotions.PromotionSimpleResponse;
import com.vivugo.backend.exception.ResourceNotFoundException;
import com.vivugo.backend.model.Promotion;
import com.vivugo.backend.model.enums.PromotionStatus;
import com.vivugo.backend.repository.PromotionRepository;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PromotionAdminService {

    private final PromotionRepository promotionRepository;

    public PromotionAdminService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    public Page<PromotionAdminResponse> getAllPromotions(int page, int size, String search, String status, String discountType, String sortBy) {
        // Mặc định sắp xếp theo ngày tạo mới nhất nếu không có sortBy
        Sort sort = Sort.by(Sort.Direction.ASC, "promotionID");
        if (sortBy != null && !sortBy.isEmpty()) {
            try {
                String[] parts = sortBy.split(",");
                String property = parts[0];
                Sort.Direction direction = (parts.length > 1 && parts[1].equalsIgnoreCase("desc"))
                        ? Sort.Direction.DESC : Sort.Direction.ASC;
                sort = Sort.by(direction, property);
            } catch (Exception e) {
                // Giữ nguyên sort mặc định nếu có lỗi
            }
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Promotion> spec = buildSpecification(search, status, discountType);

        Page<Promotion> promotionPage = promotionRepository.findAll(spec, pageable);
        return promotionPage.map(PromotionAdminResponse::new);
    }

    private Specification<Promotion> buildSpecification(String search, String status, String discountType) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // (1) Tìm kiếm theo tiêu đề (promotion code) hoặc mô tả
            if (search != null && !search.isEmpty()) {
                String pattern = "%" + search.toLowerCase() + "%";
                Predicate titleLike = cb.like(cb.lower(root.get("title")), pattern);
                Predicate descLike = cb.like(cb.lower(root.get("description")), pattern);
                predicates.add(cb.or(titleLike, descLike));
            }

            // (2) Lọc theo trạng thái
            if (status != null && !status.isEmpty()) {
                try {
                    PromotionStatus parsed = PromotionStatus.valueOf(status.toUpperCase());
                    predicates.add(cb.equal(root.get("status"), parsed));
                } catch (IllegalArgumentException e) {
                    // Nếu status không hợp lệ thì bỏ qua
                }
            }

            // (3) Lọc theo LOẠI KHUYẾN MÃI
            if (discountType != null && !discountType.isEmpty()) {
                if (discountType.equalsIgnoreCase("PERCENTAGE")) {
                    // Lọc: discountPercentage > 0
                    predicates.add(cb.greaterThan(root.get("discountPercentage"), 0));
                    // Thêm điều kiện phụ (tùy chọn): discountAmount = 0 HOẶC NULL
                    predicates.add(cb.or(
                            cb.isNull(root.get("discountAmount")),
                            cb.equal(root.get("discountAmount"), 0.0)
                    ));
                } else if (discountType.equalsIgnoreCase("FIXED_AMOUNT")) {
                    // Lọc: discountAmount > 0
                    predicates.add(cb.greaterThan(root.get("discountAmount"), 0.0));
                    // Thêm điều kiện phụ (tùy chọn): discountPercentage = 0
                    predicates.add(cb.equal(root.get("discountPercentage"), 0));
                }
            }

            // [FIX N+1]: Chỉ cần FETCH ở đây nếu bạn muốn hiển thị quan hệ (ví dụ: Tour Promotion)
            // Trong trường hợp này, Promotion không có quan hệ nhiều Tour (chỉ có TourPromotion),
            // nên ta không cần fetch.

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
    // (MỚI) Phương thức tạo khuyến mãi
    @Transactional
    public Promotion createPromotion(PromotionRequest req) {
        // Kiểm tra logic nghiệp vụ (ví dụ: title không trùng, ngày tháng hợp lệ)
        if (promotionRepository.findByTitle(req.getTitle()).isPresent()) {
            throw new IllegalArgumentException("Promotion code already exists");
        }
        if (req.getStartDate().isAfter(req.getEndDate())) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        Promotion p = new Promotion();
        // --- ĐOẠN CODE MỚI: TỰ ĐỘNG SINH ID ---
        String prefix = "promo-";
        // Lấy 1 dòng kết quả lớn nhất
        List<String> lastIds = promotionRepository.findLatestPromotionId(prefix, PageRequest.of(0, 1));

        String newId;
        if (lastIds.isEmpty()) {
            newId = prefix + "001"; // Nếu chưa có gì thì bắt đầu từ 001
        } else {
            String lastId = lastIds.get(0);
            try {
                // Cắt bỏ phần "promo-" và lấy số (ví dụ "008" -> 8)
                int number = Integer.parseInt(lastId.substring(prefix.length()));
                // Tăng lên 1 và format lại thành 3 chữ số (8 -> "009")
                newId = prefix + String.format("%03d", number + 1);
            } catch (NumberFormatException e) {
                // Phòng trường hợp ID cũ bị lỗi format, quay về mặc định an toàn
                newId = prefix + System.currentTimeMillis();
            }
        }
        p.setPromotionID(newId);
        // --- KẾT THÚC ĐOẠN CODE MỚI ---

        mapRequestToPromotion(req, p);
        p.setCurrentUsage(0); // Mới tạo thì số lần dùng là 0

        return promotionRepository.save(p);
    }
    // (MỚI) Phương thức cập nhật khuyến mãi
    @Transactional
    public Promotion updatePromotion(String id, PromotionRequest req) {
        Promotion p = promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + id));

        // Kiểm tra logic nghiệp vụ (ví dụ: title không trùng với khuyến mãi khác)
        if (promotionRepository.findByTitle(req.getTitle()).isPresent() && !p.getTitle().equals(req.getTitle())) {
            throw new IllegalArgumentException("Promotion code already exists with another ID");
        }
        if (req.getStartDate().isAfter(req.getEndDate())) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        mapRequestToPromotion(req, p);

        // Logic tự động cập nhật status (nếu cần thiết, ví dụ: nếu endDate đã qua thì tự set EXPIRED)
        if (p.getStatus() == PromotionStatus.ACTIVE && req.getEndDate().isBefore(LocalDate.now())) {
            p.setStatus(PromotionStatus.EXPIRED);
        }

        return promotionRepository.save(p);
    }
    @Transactional
    public PromotionAdminResponse getPromotionDetailById(String id) {
        Promotion p = promotionRepository.findById(id) // Sử dụng findById
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + id));
        return new PromotionAdminResponse(p);
    }

    // (MỚI) Phương thức phụ để ánh xạ DTO sang Entity
    private void mapRequestToPromotion(PromotionRequest req, Promotion p) {
        // Ánh xạ các trường cơ bản
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setLimitUsage(req.getLimitUsage());
        p.setStartDate(req.getStartDate());
        p.setEndDate(req.getEndDate());

        // *** FIX LOGIC/DATA SANITIZATION: Đảm bảo chỉ 1 loại giảm giá được set ***
        int percent = req.getDiscountPercentage();
        Double amount = req.getDiscountAmount();

        // 1. VALIDATION: Ngăn chặn cả 2 loại giảm giá > 0
        if (percent > 0 && amount != null && amount > 0.0) {
            // Ném IllegalArgumentException (sẽ được Controller bắt và trả về 400)
            throw new IllegalArgumentException("Cannot set both discount percentage (>0) and fixed discount amount (>0.0).");
        }

        // 2. MAPPING: Thực hiện mapping an toàn (chuyển null/0 thành 0.0 cho trường không dùng)
        if (percent > 0) {
            p.setDiscountPercentage(percent);
            p.setDiscountAmount(0.0); // Set Amount về 0.0 nếu Percentage được dùng
        } else if (amount != null && amount > 0.0) {
            p.setDiscountPercentage(0); // Set Percentage về 0 nếu Amount được dùng
            p.setDiscountAmount(amount);
        } else {
            // Trường hợp cả hai đều là 0 hoặc null, set cả hai về 0.0
            p.setDiscountPercentage(0);
            p.setDiscountAmount(0.0);
        }

        // *** FIX NPE RISK: Kiểm tra null/empty cho status trước khi dùng valueOf ***
        String status = req.getStatus();
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Promotion status is required.");
        }
        try {
            // Dùng toUpperCase() vì Enum PromotionStatus là chữ hoa (ACTIVE, INACTIVE, EXPIRED)
            p.setStatus(PromotionStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            // Ném lỗi rõ ràng cho trạng thái không hợp lệ
            throw new IllegalArgumentException("Invalid status value: " + status);
        }
    }

    public List<PromotionSimpleResponse> getActivePromotionsSimple() {
        List<Promotion> list = promotionRepository.findByStatus(PromotionStatus.ACTIVE);
        return list.stream()
                .map(PromotionSimpleResponse::new)
                .toList();
    }
}