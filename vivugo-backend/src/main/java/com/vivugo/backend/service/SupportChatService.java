package com.vivugo.backend.service;

import com.vivugo.backend.dto.support.SupportChatSendRequest;
import com.vivugo.backend.dto.support.SupportChatStartRequest;
import com.vivugo.backend.dto.support.SupportConversationResponse;
import com.vivugo.backend.dto.support.SupportMessageResponse;
import com.vivugo.backend.exception.ResourceNotFoundException;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.SupportConversation;
import com.vivugo.backend.model.SupportMessage;
import com.vivugo.backend.model.User;
import com.vivugo.backend.model.enums.SupportMessageSenderType;
import com.vivugo.backend.repository.SupportConversationRepository;
import com.vivugo.backend.repository.SupportMessageRepository;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SupportChatService {

    private final SupportConversationRepository supportConversationRepository;
    private final SupportMessageRepository supportMessageRepository;

    @Transactional
    public SupportConversationResponse startConversation(SupportChatStartRequest request, Account currentUser) {
        SupportConversation conversation;

        String requestedConversationId = trimToNull(request.getConversationId());
        if (requestedConversationId != null) {
            conversation = supportConversationRepository.findByConversationID(requestedConversationId)
                    .orElse(null);
        } else {
            conversation = null;
        }

        if (conversation == null) {
            conversation = resolveExistingConversation(request, currentUser).orElseGet(SupportConversation::new);
        }

        User linkedUser = currentUser != null ? currentUser.getUser() : null;
        String name = resolveName(request, linkedUser);
        String email = resolveEmail(request, linkedUser);
        String phone = resolvePhone(request, linkedUser);

        if (email == null) {
            throw new IllegalArgumentException("Email là bắt buộc để bắt đầu hội thoại.");
        }

        conversation.setCustomerName(name);
        conversation.setCustomerEmail(email);
        conversation.setCustomerPhone(phone);
        if (linkedUser != null) {
            conversation.setUser(linkedUser);
        }
        supportConversationRepository.save(conversation);

        String initialMessage = trimToNull(request.getMessage());
        if (initialMessage != null) {
            appendMessage(conversation, SupportMessageSenderType.CUSTOMER, name, initialMessage);
        }

        return SupportConversationResponse.fromEntity(conversation);
    }

    @Transactional(readOnly = true)
    public List<SupportMessageResponse> getConversationMessages(String conversationId) {
        return supportMessageRepository.findByConversation_ConversationIDOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(SupportMessageResponse::fromEntity)
                .toList();
    }

    @Transactional
    public SupportMessageResponse sendCustomerMessage(String conversationId, SupportChatSendRequest request, Account currentUser) {
        SupportConversation conversation = supportConversationRepository.findByConversationID(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        String content = trimToNull(request.getMessage());
        if (content == null) {
            throw new IllegalArgumentException("Nội dung tin nhắn không được để trống.");
        }

        String senderName = resolveName(null, currentUser != null ? currentUser.getUser() : conversation.getUser());
        SupportMessage message = appendMessage(conversation, SupportMessageSenderType.CUSTOMER, senderName, content);
        return SupportMessageResponse.fromEntity(message);
    }

    @Transactional
    public SupportMessageResponse sendAdminMessage(String conversationId, String adminName, String messageContent) {
        SupportConversation conversation = supportConversationRepository.findByConversationID(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        String content = trimToNull(messageContent);
        if (content == null) {
            throw new IllegalArgumentException("Nội dung phản hồi không được để trống.");
        }

        String safeAdminName = trimToNull(adminName);
        if (safeAdminName == null) {
            safeAdminName = "Admin";
        }

        SupportMessage message = appendMessage(conversation, SupportMessageSenderType.ADMIN, safeAdminName, content);
        return SupportMessageResponse.fromEntity(message);
    }

    @Transactional(readOnly = true)
    public Page<SupportConversationResponse> getConversationsForAdmin(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        Specification<SupportConversation> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            String keyword = trimToNull(search);
            if (keyword != null) {
                String like = "%" + keyword.toLowerCase() + "%";
                predicates.add(
                        cb.or(
                                cb.like(cb.lower(root.get("customerName")), like),
                                cb.like(cb.lower(root.get("customerEmail")), like),
                                cb.like(cb.lower(root.get("customerPhone")), like),
                                cb.like(cb.lower(root.get("lastMessagePreview")), like)
                        )
                );
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return supportConversationRepository.findAll(specification, pageable)
                .map(SupportConversationResponse::fromEntity);
    }

    private java.util.Optional<SupportConversation> resolveExistingConversation(SupportChatStartRequest request, Account currentUser) {
        if (currentUser != null && currentUser.getUser() != null) {
            return supportConversationRepository.findFirstByUser_UserIDOrderByUpdatedAtDesc(currentUser.getUser().getUserID());
        }

        String email = trimToNull(request.getEmail());
        if (email != null) {
            return supportConversationRepository.findFirstByCustomerEmailOrderByUpdatedAtDesc(email);
        }
        return java.util.Optional.empty();
    }

    private SupportMessage appendMessage(
            SupportConversation conversation,
            SupportMessageSenderType senderType,
            String senderName,
            String content
    ) {
        SupportMessage message = new SupportMessage();
        message.setConversation(conversation);
        message.setSenderType(senderType);
        message.setSenderName(senderName);
        message.setContent(content);
        supportMessageRepository.save(message);

        conversation.setLastMessageAt(LocalDateTime.now());
        conversation.setLastMessagePreview(content.length() > 180 ? content.substring(0, 180) : content);
        conversation.setReplied(senderType == SupportMessageSenderType.ADMIN);
        supportConversationRepository.save(conversation);
        return message;
    }

    private String resolveName(SupportChatStartRequest request, User linkedUser) {
        if (linkedUser != null && trimToNull(linkedUser.getName()) != null) {
            return linkedUser.getName().trim();
        }
        if (request != null && trimToNull(request.getName()) != null) {
            return request.getName().trim();
        }
        return "Khách hàng";
    }

    private String resolveEmail(SupportChatStartRequest request, User linkedUser) {
        if (linkedUser != null && trimToNull(linkedUser.getEmail()) != null) {
            return linkedUser.getEmail().trim();
        }
        if (request != null && trimToNull(request.getEmail()) != null) {
            return request.getEmail().trim();
        }
        return null;
    }

    private String resolvePhone(SupportChatStartRequest request, User linkedUser) {
        if (linkedUser != null && trimToNull(linkedUser.getPhoneNumber()) != null) {
            return linkedUser.getPhoneNumber().trim();
        }
        if (request != null && trimToNull(request.getPhone()) != null) {
            return request.getPhone().trim();
        }
        return null;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

