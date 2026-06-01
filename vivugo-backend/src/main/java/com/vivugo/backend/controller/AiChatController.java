package com.vivugo.backend.controller;

import com.vivugo.backend.dto.ChatRequest;
import com.vivugo.backend.dto.ChatResponse;
import com.vivugo.backend.service.AiChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.GET})
public class AiChatController {

    private final AiChatService aiChatService;

    public AiChatController(AiChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request, Authentication authentication) {
        ChatResponse response = aiChatService.getChatResponse(
                request.getMessages(),
                request.getSessionId(),
                authentication
        );
        return ResponseEntity.ok(response);
    }
}
