package com.vivugo.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        return health();
    }

    @GetMapping("/api")
    public ResponseEntity<Map<String, Object>> apiIndex() {
        return health();
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "vivugo-backend",
                "timestamp", Instant.now().toString(),
                "databaseEndpoints", List.of(
                        "/api/tours",
                        "/api/destinations",
                        "/api/tour-types",
                        "/api/admin/dashboard/stats"
                )
        ));
    }
}
