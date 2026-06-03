package com.vivugo.backend.admin.service;

import com.vivugo.backend.admin.dto.request.AdminReplyRequest;
import com.vivugo.backend.admin.dto.response.ContactMessage.ContactMessageResponse;
import com.vivugo.backend.dto.support.SupportConversationResponse;
import com.vivugo.backend.dto.support.SupportMessageResponse;
import com.vivugo.backend.exception.ResourceNotFoundException;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.ContactMessage;
import com.vivugo.backend.model.SupportConversation;
import com.vivugo.backend.repository.ContactMessageRepository;
import com.vivugo.backend.repository.SupportConversationRepository;
import com.vivugo.backend.service.ContactMessageDemoSeeder;
import com.vivugo.backend.service.SupportChatService;
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
public class ContactAdminService {

    private final ContactMessageRepository contactMessageRepository;
    private final SupportConversationRepository supportConversationRepository;
    private final SupportChatService supportChatService;
    private final ContactMessageDemoSeeder contactMessageDemoSeeder;

    public Page<ContactMessageResponse> getAllMessages(int page, int size, String search) {
        if (page == 0 && (search == null || search.isBlank())) {
            contactMessageDemoSeeder.seedIfNeeded();
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "sentAt"));
        Specification<ContactMessage> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.isBlank()) {
                String keyword = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("email")), keyword),
                        cb.like(cb.lower(root.get("phone")), keyword),
                        cb.like(cb.lower(root.get("message")), keyword),
                        cb.like(cb.lower(root.get("contactMessID")), keyword),
                        cb.like(cb.lower(root.get("name")), keyword),
                        cb.like(cb.lower(root.get("subject")), keyword)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return contactMessageRepository.findAll(spec, pageable).map(ContactMessageResponse::new);
    }

    @Transactional
    public SupportMessageResponse replyToMessage(String contactMessageId, AdminReplyRequest request, Account currentAdmin) {
        ContactMessage message = contactMessageRepository.findById(contactMessageId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found"));

        SupportConversation conversation = message.getConversation();
        if (conversation == null) {
            conversation = resolveOrCreateConversationFromMessage(message);
            message.setConversation(conversation);
        }

        String adminName = currentAdmin != null ? currentAdmin.getUsername() : "Admin";
        SupportMessageResponse response = supportChatService.sendAdminMessage(
                conversation.getConversationID(),
                adminName,
                request.getMessage()
        );

        message.setResponded(true);
        message.setRespondedAt(LocalDateTime.now());
        message.setRespondedBy(adminName);
        contactMessageRepository.save(message);
        return response;
    }

    public Page<SupportConversationResponse> getConversations(int page, int size, String search) {
        return supportChatService.getConversationsForAdmin(page, size, search);
    }

    public List<SupportMessageResponse> getConversationMessages(String conversationId) {
        return supportChatService.getConversationMessages(conversationId);
    }

    @Transactional
    public SupportMessageResponse replyConversation(String conversationId, AdminReplyRequest request, Account currentAdmin) {
        String adminName = currentAdmin != null ? currentAdmin.getUsername() : "Admin";
        SupportMessageResponse response = supportChatService.sendAdminMessage(conversationId, adminName, request.getMessage());

        SupportConversation conversation = supportConversationRepository.findByConversationID(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        contactMessageRepository.findAll(
                (root, query, cb) -> cb.equal(root.get("conversation"), conversation)
        ).forEach(item -> {
            if (!item.isResponded()) {
                item.setResponded(true);
                item.setRespondedAt(LocalDateTime.now());
                item.setRespondedBy(adminName);
                contactMessageRepository.save(item);
            }
        });

        return response;
    }

    private SupportConversation resolveOrCreateConversationFromMessage(ContactMessage message) {
        if (message.getEmail() != null && !message.getEmail().isBlank()) {
            return supportConversationRepository.findFirstByCustomerEmailOrderByUpdatedAtDesc(message.getEmail().trim())
                    .orElseGet(() -> createConversation(message));
        }
        return createConversation(message);
    }

    private SupportConversation createConversation(ContactMessage message) {
        SupportConversation conversation = new SupportConversation();
        conversation.setCustomerName(
                message.getName() != null && !message.getName().isBlank() ? message.getName().trim() : "Khách hàng"
        );
        conversation.setCustomerEmail(message.getEmail());
        conversation.setCustomerPhone(message.getPhone());
        conversation.setUser(message.getUser());
        conversation.setLastMessageAt(message.getSentAt());
        conversation.setLastMessagePreview(message.getMessage());
        conversation.setReplied(false);
        return supportConversationRepository.save(conversation);
    }
}
