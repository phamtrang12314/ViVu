package com.vivugo.backend.admin.controller;

import com.vivugo.backend.admin.dto.request.AdminAiInsightRequest;
import com.vivugo.backend.admin.dto.response.dashboard.AdminAiInsightResponse;
import com.vivugo.backend.admin.service.AdminAiInsightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/ai")
public class AdminAiController {

    private final AdminAiInsightService adminAiInsightService;

    public AdminAiController(AdminAiInsightService adminAiInsightService) {
        this.adminAiInsightService = adminAiInsightService;
    }

    @PostMapping("/insights")
    public ResponseEntity<AdminAiInsightResponse> generateInsights(@RequestBody(required = false) AdminAiInsightRequest request) {
        return ResponseEntity.ok(adminAiInsightService.generateInsights(request));
    }
}
