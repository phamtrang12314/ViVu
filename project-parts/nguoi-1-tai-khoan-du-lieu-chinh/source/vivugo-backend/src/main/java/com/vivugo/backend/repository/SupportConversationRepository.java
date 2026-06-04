package com.vivugo.backend.repository;

import com.vivugo.backend.model.SupportConversation;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportConversationRepository extends JpaRepository<SupportConversation, String>, JpaSpecificationExecutor<SupportConversation> {
    Optional<SupportConversation> findByConversationID(String conversationID);
    Optional<SupportConversation> findFirstByUser_UserIDOrderByUpdatedAtDesc(String userID);
    Optional<SupportConversation> findFirstByCustomerEmailOrderByUpdatedAtDesc(String customerEmail);
}

