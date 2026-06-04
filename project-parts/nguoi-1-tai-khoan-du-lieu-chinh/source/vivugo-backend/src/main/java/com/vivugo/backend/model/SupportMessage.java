package com.vivugo.backend.model;

import com.vivugo.backend.model.enums.SupportMessageSenderType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "support_messages")
public class SupportMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String supportMessageID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private SupportConversation conversation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupportMessageSenderType senderType;

    @Column(nullable = false)
    private String senderName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public String getSupportMessageID() {
        return supportMessageID;
    }

    public void setSupportMessageID(String supportMessageID) {
        this.supportMessageID = supportMessageID;
    }

    public SupportConversation getConversation() {
        return conversation;
    }

    public void setConversation(SupportConversation conversation) {
        this.conversation = conversation;
    }

    public SupportMessageSenderType getSenderType() {
        return senderType;
    }

    public void setSenderType(SupportMessageSenderType senderType) {
        this.senderType = senderType;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

