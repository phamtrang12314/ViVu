package com.vivugo.backend.admin.controller;

import com.vivugo.backend.admin.dto.request.AdminReplyRequest;
import com.vivugo.backend.admin.dto.response.ContactMessage.ContactMessageResponse;
import com.vivugo.backend.admin.service.ContactAdminService;
import com.vivugo.backend.dto.support.SupportConversationResponse;
import com.vivugo.backend.dto.support.SupportMessageResponse;
import com.vivugo.backend.model.Account;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/contact-messages")
@RequiredArgsConstructor
public class ContactAdminController {

    private final ContactAdminService contactAdminService;

    @GetMapping
    public ResponseEntity<Page<ContactMessageResponse>> getAllContactMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(contactAdminService.getAllMessages(page, size, search));
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<SupportMessageResponse> replyContactMessage(
            @PathVariable String id,
            @RequestBody AdminReplyRequest request,
            @AuthenticationPrincipal Account currentAdmin
    ) {
        return ResponseEntity.ok(contactAdminService.replyToMessage(id, request, currentAdmin));
    }

    @GetMapping("/conversations")
    public ResponseEntity<Page<SupportConversationResponse>> getConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(contactAdminService.getConversations(page, size, search));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<SupportMessageResponse>> getConversationMessages(@PathVariable String conversationId) {
        return ResponseEntity.ok(contactAdminService.getConversationMessages(conversationId));
    }

    @PostMapping("/conversations/{conversationId}/reply")
    public ResponseEntity<SupportMessageResponse> replyConversation(
            @PathVariable String conversationId,
            @RequestBody AdminReplyRequest request,
            @AuthenticationPrincipal Account currentAdmin
    ) {
        return ResponseEntity.ok(contactAdminService.replyConversation(conversationId, request, currentAdmin));
    }
}

