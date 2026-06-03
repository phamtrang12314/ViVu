package com.vivugo.backend.dto.support;

import com.vivugo.backend.model.SupportMessage;
import com.vivugo.backend.model.enums.SupportMessageSenderType;
import lombok.Data;

@Data
public class SupportMessageResponse {
    private String messageId;
    private String conversationId;
    private SupportMessageSenderType senderType;
    private String senderName;
    private String content;
    private String createdAt;

    public static SupportMessageResponse fromEntity(SupportMessage message) {
        SupportMessageResponse response = new SupportMessageResponse();
        response.setMessageId(message.getSupportMessageID());
        response.setConversationId(message.getConversation().getConversationID());
        response.setSenderType(message.getSenderType());
        response.setSenderName(message.getSenderName());
        response.setContent(message.getContent());
        response.setCreatedAt(message.getCreatedAt() != null ? message.getCreatedAt().toString() : null);
        return response;
    }
}

