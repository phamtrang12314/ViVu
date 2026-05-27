package com.vivugo.backend.admin.service;

import com.vivugo.backend.admin.dto.request.DestinationRequest;
import com.vivugo.backend.admin.dto.response.destination.DestinationAdminResponse;
import com.vivugo.backend.admin.dto.response.destination.DestinationDetailAdminResponse;
import com.vivugo.backend.model.Destination;
import com.vivugo.backend.model.Image;
import com.vivugo.backend.repository.DestinationRepository;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DestinationAdminService {

    private final DestinationRepository destinationRepository;


    public DestinationAdminService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    // Dùng cho /tour: lấy tất cả destination (không phân trang)
    public List<DestinationAdminResponse> getAll() {
        return destinationRepository.findAll()
                .stream()
                .map(DestinationAdminResponse::new)
                .toList();
    }

    // Dùng cho /tour: filter theo region
    public List<DestinationAdminResponse> getByRegion(String region) {
        return destinationRepository.findAllByRegion(region)
                .stream()
                .map(DestinationAdminResponse::new)
                .toList();
    }

    // Dùng cho màn Manage Destination: phân trang + search + filter
    public Page<DestinationAdminResponse> getAllDestinations(
            int page,
            int size,
            String search,
            String region,
            String location
    ) {
        Pageable pageable = PageRequest.of(page, size);

        Specification<Destination> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // search theo nameDes hoặc location
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(
                        cb.or(
                                cb.like(cb.lower(root.get("nameDes")), pattern),
                                cb.like(cb.lower(root.get("location")), pattern)
                        )
                );
            }

            // filter region
            if (region != null && !region.isBlank()) {
                predicates.add(
                        cb.equal(cb.lower(root.get("region")), region.toLowerCase())
                );
            }

            // filter location
            if (location != null && !location.isBlank()) {
                predicates.add(
                        cb.equal(cb.lower(root.get("location")), location.toLowerCase())
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Destination> pageData = destinationRepository.findAll(spec, pageable);
        return pageData.map(DestinationAdminResponse::new);
    }

    // chi tiết
    public DestinationDetailAdminResponse getDestinationDetail(String id) {
        Destination des = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        return new DestinationDetailAdminResponse(des);
    }

    // tạo mã
    private String buildDestinationId(String region) {
        if (region == null) {
            region = "";
        }
        String normalized = region.trim().toLowerCase();

        String regionCode;
        switch (normalized) {
            case "miền bắc":
            case "mien bac":
            case "mb":
                regionCode = "mb";
                break;
            case "miền trung":
            case "mien trung":
            case "mt":
                regionCode = "mt";
                break;
            case "miền nam":
            case "mien nam":
            case "mn":
                regionCode = "mn";
                break;
            default:
                // fallback, tùy bạn muốn xử lý thế nào
                regionCode = "xx";
        }

        // Đếm số destination hiện có trong miền này
        long count = destinationRepository.countByRegionIgnoreCase(region);
        long nextIndex = count + 1; // số thứ tự tiếp theo

        String indexStr = String.format("%02d", nextIndex); // 01, 02, 03, ...

        return "dest-" + regionCode + "-" + indexStr;
    }


    @Transactional
    public Destination createDestination(DestinationRequest req) {
        Destination d = new Destination();
        String destId = buildDestinationId(req.getRegion());
        d.setDestinationID(destId);
        d.setNameDes(req.getNameDes());
        d.setRegion(req.getRegion());
        d.setLocation(req.getLocation());
        d.setCountry(req.getCountry());

        if (req.getImageUrls() != null && !req.getImageUrls().isEmpty()) {
            List<Image> images = req.getImageUrls().stream().map(url -> {
                Image img = new Image();
                img.setUrl(url);
                img.setDestination(d);
                return img;
            }).collect(Collectors.toList());
            d.setImages(images);
        }

        return destinationRepository.save(d);
    }

    // cập nhật

    @Transactional
    public Destination updateDestination(String id, DestinationRequest dto) {
        Destination d = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        d.setNameDes(dto.getNameDes());
        d.setRegion(dto.getRegion());
        d.setLocation(dto.getLocation());
        d.setCountry(dto.getCountry());

        // Clear images cũ -> orphanRemoval = true sẽ tự xóa trong DB
        if (d.getImages() != null) {
            d.getImages().clear();
        }

        // Thêm images mới
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            for (String url : dto.getImageUrls()) {
                if (url == null || url.isBlank()) continue;
                Image img = new Image();
                img.setUrl(url);
                img.setDestination(d);
                d.getImages().add(img);
            }
        }

        return destinationRepository.save(d);
    }


}
