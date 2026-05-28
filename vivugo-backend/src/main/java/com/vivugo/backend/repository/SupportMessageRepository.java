package com.vivugo.backend.repository;

import com.vivugo.backend.model.SupportMessage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportMessageRepository extends JpaRepository<SupportMessage, String> {
    List<SupportMessage> findByConversation_ConversationIDOrderByCreatedAtAsc(String conversationID);
}

