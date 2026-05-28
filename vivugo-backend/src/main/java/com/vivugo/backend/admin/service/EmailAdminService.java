package com.vivugo.backend.admin.service;

public interface EmailAdminService {
    void send(String to, String subject, String body);
}
