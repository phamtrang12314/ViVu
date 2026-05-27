package com.vivugo.backend.repository;

import com.vivugo.backend.model.Promotion;
import com.vivugo.backend.model.enums.PromotionStatus;
import org.springframework.data.domain.Pageable; // Nhớ thêm import này
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query; // Nhớ thêm import này
import org.springframework.data.repository.query.Param; // Nhớ thêm import này
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion,String>,
        JpaSpecificationExecutor<Promotion> {
    Optional<Promotion> findByTitle(String title);
    // Tìm ID có dạng 'promo-%' và sắp xếp giảm dần để lấy cái lớn nhất
    @Query("SELECT p.promotionID FROM Promotion p WHERE p.promotionID LIKE :prefix% ORDER BY LENGTH(p.promotionID) DESC, p.promotionID DESC")
    List<String> findLatestPromotionId(@Param("prefix") String prefix, Pageable pageable);

    List<Promotion> findByStatus(PromotionStatus promotionStatus);
}
