package com.vivugo.backend.controller;

import com.vivugo.backend.dto.RecommendationResponse;
import com.vivugo.backend.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/personalized")
    public ResponseEntity<RecommendationResponse> getPersonalizedRecommendations(
            @RequestParam(required = false) String sessionId,
            @RequestParam(defaultValue = "8") int size,
            Authentication authentication
    ) {
        return ResponseEntity.ok(recommendationService.getPersonalizedTours(sessionId, authentication, size));
    }
}
