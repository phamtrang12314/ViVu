package com.vivugo.backend.dto.support;

import com.vivugo.backend.model.SupportConversation;
import lombok.Data;

@Data
public class SupportConversationResponse {
    private String conversationId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String avatarURL;
    private boolean replied;
    private String lastMessageAt;
    private String lastMessagePreview;

    public static SupportConversationResponse fromEntity(SupportConversation conversation) {
        SupportConversationResponse response = new SupportConversationResponse();
        response.setConversationId(conversation.getConversationID());
        response.setCustomerName(conversation.getCustomerName());
        response.setCustomerEmail(conversation.getCustomerEmail());
        response.setCustomerPhone(conversation.getCustomerPhone());
        response.setAvatarURL(
                conversation.getUser() != null ? conversation.getUser().getAvatarURL() : null
        );
        response.setReplied(conversation.isReplied());
        response.setLastMessageAt(conversation.getLastMessageAt() != null ? conversation.getLastMessageAt().toString() : null);
        response.setLastMessagePreview(conversation.getLastMessagePreview());
        return response;
    }
}
