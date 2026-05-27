package com.vivugo.backend.repository;

import com.vivugo.backend.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


@Repository

public interface ContactMessageRepository extends JpaRepository<ContactMessage, String>,
        JpaSpecificationExecutor<ContactMessage> {
    long count();
}