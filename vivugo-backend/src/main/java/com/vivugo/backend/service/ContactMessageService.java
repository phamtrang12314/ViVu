package com.vivugo.backend.service;

import com.vivugo.backend.dto.ContactMessageRequest;
import com.vivugo.backend.dto.support.SupportChatStartRequest;
import com.vivugo.backend.dto.support.SupportConversationResponse;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.ContactMessage;
import com.vivugo.backend.model.SupportConversation;
import com.vivugo.backend.model.User;
import com.vivugo.backend.repository.ContactMessageRepository;
import com.vivugo.backend.repository.SupportConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;
    private final SupportConversationRepository supportConversationRepository;
    private final SupportChatService supportChatService;

    @Transactional
    public ContactMessage saveNewContactMessage(ContactMessageRequest request, Account currentUser) {
        ContactMessage contactMessage = new ContactMessage();
        contactMessage.setName(request.getName());
        contactMessage.setSubject(request.getSubject());
        contactMessage.setEmail(request.getEmail());
        contactMessage.setPhone(request.getPhone());
        contactMessage.setMessage(request.getMessage());
        contactMessage.setResponded(false);

        User linkedUser = currentUser != null ? currentUser.getUser() : null;
        if (linkedUser != null) {
            contactMessage.setUser(linkedUser);
        }

        SupportChatStartRequest startRequest = new SupportChatStartRequest();
        startRequest.setName(request.getName());
        startRequest.setEmail(request.getEmail());
        startRequest.setPhone(request.getPhone());

        String initial = request.getSubject() == null || request.getSubject().isBlank()
                ? request.getMessage()
                : "[" + request.getSubject().trim() + "] " + request.getMessage();
        startRequest.setMessage(initial);

        SupportConversationResponse conversationResponse = supportChatService.startConversation(startRequest, currentUser);
        SupportConversation conversation = supportConversationRepository.findByConversationID(conversationResponse.getConversationId())
                .orElse(null);
        contactMessage.setConversation(conversation);

        return contactMessageRepository.save(contactMessage);
    }
}

