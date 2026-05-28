package com.vivugo.backend.admin.service;

import com.vivugo.backend.admin.dto.request.TourTypeRequest;
import com.vivugo.backend.admin.dto.response.tourType.TourTypeAdminResponse;
import com.vivugo.backend.admin.dto.response.tourType.TourTypeResponse;
import com.vivugo.backend.admin.dto.response.tourType.TourTypeDetailAdminResponse;
import com.vivugo.backend.model.TourType;
import com.vivugo.backend.repository.TourTypeRepository;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TourTypeAdminService {

    private final TourTypeRepository tourTypeRepository;

    public TourTypeAdminService(TourTypeRepository tourTypeRepository) {
        this.tourTypeRepository = tourTypeRepository;
    }

    public List<TourTypeResponse> getAllForTour() {
        return tourTypeRepository.findAll().stream()
                .map(TourTypeResponse::new)
                .toList();
    }

    // Lấy tất cả (cho combobox, không phân trang)
    public List<TourTypeAdminResponse> getAll() {
        return tourTypeRepository.findAll()
                .stream()
                .map(TourTypeAdminResponse::new)
                .toList();
    }

    // List phân trang + search theo nameType
    public Page<TourTypeAdminResponse> getAllTourTypes(
            int page,
            int size,
            String search
    ) {
        Pageable pageable = PageRequest.of(page, size);

        Specification<TourType> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(
                        cb.like(cb.lower(root.get("nameType")), pattern)
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<TourType> pageData = tourTypeRepository.findAll(spec, pageable);
        return pageData.map(TourTypeAdminResponse::new);
    }

    // Chi tiết
    public TourTypeDetailAdminResponse getDetail(String id) {
        TourType type = tourTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour type not found"));
        return new TourTypeDetailAdminResponse(type);
    }

    // Tạo mới
    private String buildTourTypeId() {
        long count = tourTypeRepository.count();  // đếm số loại tour hiện tại
        long nextIndex = count + 1;               // tăng lên 1
        String indexStr = String.format("%02d", nextIndex); // 01, 02, 03,...
        return "type-" + indexStr;
    }

    @Transactional
    public TourType create(TourTypeRequest req) {
        if (tourTypeRepository.existsByNameTypeIgnoreCase(req.getNameType())) {
            throw new RuntimeException("Tên loại tour đã tồn tại");
        }
        TourType t = new TourType();
        String id = buildTourTypeId();
        t.setTourTypeID(id);
        t.setNameType(req.getNameType());
        t.setDescription(req.getDescription());
        return tourTypeRepository.save(t);
    }

    // Cập nhật
    @Transactional
    public TourType update(String id, TourTypeRequest req) {
        TourType t = tourTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour type not found"));

        // nếu đổi nameType, kiểm tra trùng
        if (!t.getNameType().equalsIgnoreCase(req.getNameType())
                && tourTypeRepository.existsByNameTypeIgnoreCase(req.getNameType())) {
            throw new RuntimeException("Tên loại tour đã tồn tại");
        }

        t.setNameType(req.getNameType());
        t.setDescription(req.getDescription());
        return tourTypeRepository.save(t);
    }

    // Xóa
    @Transactional
    public void delete(String id) {
        TourType t = tourTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour type not found"));
        if (t.getTours() != null && !t.getTours().isEmpty()) {
            throw new RuntimeException("Không thể xóa loại tour đang được sử dụng bởi tour.");
        }
        tourTypeRepository.delete(t);
    }
}
