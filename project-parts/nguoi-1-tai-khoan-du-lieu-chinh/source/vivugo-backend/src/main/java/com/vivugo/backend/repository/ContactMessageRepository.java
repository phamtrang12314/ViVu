package com.vivugo.backend.repository;

import com.vivugo.backend.model.ContactMessage;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


@Repository

public interface ContactMessageRepository extends JpaRepository<ContactMessage, String>,
        JpaSpecificationExecutor<ContactMessage> {
    long count();
    long countByRespondedFalse();

    long countBySentAtBetween(LocalDateTime from, LocalDateTime to);
    long countByRespondedFalseAndSentAtBetween(LocalDateTime from, LocalDateTime to);

    @EntityGraph(attributePaths = {"user"})
    Page<ContactMessage> findAllByOrderBySentAtDesc(Pageable pageable);
}
