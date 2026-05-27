package com.vivugo.backend.dto;

import java.util.List;
import java.util.Map;

public class ChatResponse {
    private String reply;
    // Dùng Map để chứa các trường cơ bản của Tour, tránh lỗi đệ quy @OneToMany
    private List<Map<String, Object>> tours;

    public ChatResponse() {}

    public ChatResponse(String reply, List<Map<String, Object>> tours) {
        this.reply = reply;
        this.tours = tours;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public List<Map<String, Object>> getTours() {
        return tours;
    }

    public void setTours(List<Map<String, Object>> tours) {
        this.tours = tours;
    }
}