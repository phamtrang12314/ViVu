package com.vivugo.backend.repository;

import com.vivugo.backend.model.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCode, String> {
    Optional<OtpCode> findTopByEmailAndPurposeAndCodeAndUsedFalseOrderByCreatedAtDesc(
            String email,
            String purpose,
            String code
    );

    List<OtpCode> findByEmailAndPurposeAndUsedFalse(String email, String purpose);
}
