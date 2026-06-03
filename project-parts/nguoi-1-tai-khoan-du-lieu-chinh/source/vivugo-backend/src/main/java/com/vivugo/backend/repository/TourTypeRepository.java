package com.vivugo.backend.repository;

import com.vivugo.backend.model.TourType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourTypeRepository extends JpaRepository<TourType, String> {
    // Spring Data JPA sẽ tự động cung cấp phương thức findAll()
    // mà chúng ta cần.
    boolean existsByNameTypeIgnoreCase(String nameType);

    @Override
    @EntityGraph(attributePaths = {"tours"})
    List<TourType> findAll();

    @Override
    @EntityGraph(attributePaths = {"tours"})
    Optional<TourType> findById(String id);

    Page<TourType> findAll(Specification<TourType> spec, Pageable pageable);
}