package com.vivugo.backend.controller;

import com.vivugo.backend.dto.ContactMessageRequest;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.ContactMessage;
import com.vivugo.backend.service.ContactMessageService;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact-messages")
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageService contactMessageService;

    @PostMapping
    public ResponseEntity<?> createContactMessage(
            @RequestBody ContactMessageRequest request,
            @AuthenticationPrincipal Account currentUser
    ) {
        if (request.getEmail() == null || request.getEmail().isBlank()
                || request.getMessage() == null || request.getMessage().isBlank()) {
            return ResponseEntity.badRequest().body("Email và nội dung tin nhắn là bắt buộc.");
        }

        try {
            ContactMessage newMessage = contactMessageService.saveNewContactMessage(request, currentUser);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tin nhắn của bạn đã được gửi thành công!");
            response.put("contactMessId", newMessage.getContactMessID());
            response.put("conversationId", newMessage.getConversation() != null ? newMessage.getConversation().getConversationID() : null);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi hệ thống khi gửi tin nhắn: " + e.getMessage());
        }
    }
}

