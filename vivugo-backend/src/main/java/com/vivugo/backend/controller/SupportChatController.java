package com.vivugo.backend.controller;

import com.vivugo.backend.dto.support.SupportChatSendRequest;
import com.vivugo.backend.dto.support.SupportChatStartRequest;
import com.vivugo.backend.dto.support.SupportConversationResponse;
import com.vivugo.backend.dto.support.SupportMessageResponse;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.service.SupportChatService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact-messages/chat")
@RequiredArgsConstructor
public class SupportChatController {

    private final SupportChatService supportChatService;

    @PostMapping("/start")
    public ResponseEntity<SupportConversationResponse> startConversation(
            @RequestBody SupportChatStartRequest request,
            @AuthenticationPrincipal Account currentUser
    ) {
        return ResponseEntity.ok(supportChatService.startConversation(request, currentUser));
    }

    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<List<SupportMessageResponse>> getMessages(@PathVariable String conversationId) {
        return ResponseEntity.ok(supportChatService.getConversationMessages(conversationId));
    }

    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<SupportMessageResponse> sendMessage(
            @PathVariable String conversationId,
            @RequestBody SupportChatSendRequest request,
            @AuthenticationPrincipal Account currentUser
    ) {
        return ResponseEntity.ok(supportChatService.sendCustomerMessage(conversationId, request, currentUser));
    }
}

