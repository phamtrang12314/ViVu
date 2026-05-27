package com.vivugo.backend.repository;

import com.vivugo.backend.model.Destination;
import org.springframework.data.jpa.repository.EntityGraph; // (1) THÊM IMPORT
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, String>,
        JpaSpecificationExecutor<Destination> {

    // (2) SỬA LỖI: Thêm @EntityGraph để fetch 'images' ngay lập tức
    // Đây là fix cho lỗi N+1 và LazyInitializationException
    @Override
    @EntityGraph(attributePaths = {"images"}) // Tải 'images' cùng lúc
    List<Destination> findAll();

    // (3) SỬA LỖI: Tương tự, thêm cho phương thức này
    @EntityGraph(attributePaths = {"images"}) // Tải 'images' cùng lúc
    List<Destination> findAllByRegion(String region);

    @Override
    @EntityGraph(attributePaths = {
            "images",
            "tourDestinations",
            "tourDestinations.tour"
    })
    Optional<Destination> findById(String id);

    // tạo mã
    long countByRegionIgnoreCase(String region);
}