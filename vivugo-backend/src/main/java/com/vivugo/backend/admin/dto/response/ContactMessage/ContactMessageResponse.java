package com.vivugo.backend.admin.dto.response.ContactMessage;

import com.vivugo.backend.model.ContactMessage;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ContactMessageResponse {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String subject;
    private String message;
    private String sentAt;
    private String userID;
    private String userName;
    private boolean responded;
    private String respondedAt;
    private String respondedBy;
    private String conversationId;

    public ContactMessageResponse(ContactMessage msg) {
        this.id = msg.getContactMessID();
        this.name = msg.getName();
        this.email = msg.getEmail();
        this.phone = msg.getPhone();
        this.subject = msg.getSubject();
        this.message = msg.getMessage();
        this.sentAt = msg.getSentAt() != null ? msg.getSentAt().toString() : null;
        this.responded = msg.isResponded();
        this.respondedAt = msg.getRespondedAt() != null ? msg.getRespondedAt().toString() : null;
        this.respondedBy = msg.getRespondedBy();

        if (msg.getUser() != null) {
            this.userID = msg.getUser().getUserID();
            this.userName = msg.getUser().getName();
        } else {
            this.userName = "Guest";
        }

        if (msg.getConversation() != null) {
            this.conversationId = msg.getConversation().getConversationID();
        }
    }
}

