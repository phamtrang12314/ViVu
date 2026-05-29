package com.vivugo.backend.admin.controller;

import com.vivugo.backend.admin.dto.response.ContactMessage.ContactMessageResponse;
import com.vivugo.backend.admin.service.ContactAdminService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/contact-messages")
public class ContactAdminController {

    private final ContactAdminService contactAdminService;

    public ContactAdminController(ContactAdminService contactAdminService) {
        this.contactAdminService = contactAdminService;
    }

    // GET /api/admin/contact-messages?page=0&size=10&search=...
    @GetMapping
    public ResponseEntity<Page<ContactMessageResponse>> getAllContactMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search
    ) {
        Page<ContactMessageResponse> result = contactAdminService.getAllMessages(page, size, search);
        return ResponseEntity.ok(result);
    }
}