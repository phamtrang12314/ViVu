package com.vivugo.backend.dto.support;

import lombok.Data;

@Data
public class SupportChatStartRequest {
    private String conversationId;
    private String name;
    private String email;
    private String phone;
    private String message;
}

