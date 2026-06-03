package com.vivugo.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class ApiRateLimitFilter extends OncePerRequestFilter {

    private static final class CounterWindow {
        private long windowStartMs;
        private int requestCount;
    }

    private static final class LimitPolicy {
        private final String bucket;
        private final int maxRequests;

        private LimitPolicy(String bucket, int maxRequests) {
            this.bucket = bucket;
            this.maxRequests = maxRequests;
        }
    }

    private final boolean enabled;
    private final int windowSeconds;
    private final int aiLimitPerWindow;
    private final int authLimitPerWindow;
    private final int bookingWriteLimitPerWindow;
    private final Map<String, CounterWindow> counters = new ConcurrentHashMap<>();

    public ApiRateLimitFilter(
            @Value("${app.rate-limit.enabled:true}") boolean enabled,
            @Value("${app.rate-limit.window-seconds:60}") int windowSeconds,
            @Value("${app.rate-limit.ai.max-requests:30}") int aiLimitPerWindow,
            @Value("${app.rate-limit.auth.max-requests:40}") int authLimitPerWindow,
            @Value("${app.rate-limit.booking-write.max-requests:30}") int bookingWriteLimitPerWindow
    ) {
        this.enabled = enabled;
        this.windowSeconds = Math.max(10, windowSeconds);
        this.aiLimitPerWindow = Math.max(1, aiLimitPerWindow);
        this.authLimitPerWindow = Math.max(1, authLimitPerWindow);
        this.bookingWriteLimitPerWindow = Math.max(1, bookingWriteLimitPerWindow);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (!enabled) {
            filterChain.doFilter(request, response);
            return;
        }

        LimitPolicy policy = resolvePolicy(request);
        if (policy == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String bucketKey = policy.bucket + ":" + extractClientKey(request);
        if (isExceeded(bucketKey, policy.maxRequests)) {
            response.setStatus(429);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"message\":\"Too many requests. Please retry shortly.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isExceeded(String bucketKey, int maxRequests) {
        long now = System.currentTimeMillis();
        long windowMs = windowSeconds * 1000L;

        CounterWindow window = counters.compute(bucketKey, (key, current) -> {
            if (current == null || now - current.windowStartMs >= windowMs) {
                CounterWindow fresh = new CounterWindow();
                fresh.windowStartMs = now;
                fresh.requestCount = 1;
                return fresh;
            }
            current.requestCount += 1;
            return current;
        });

        return window != null && window.requestCount > maxRequests;
    }

    private LimitPolicy resolvePolicy(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        if (path == null) {
            return null;
        }

        if (path.startsWith("/api/admin/ai/")) {
            return new LimitPolicy("admin-ai", aiLimitPerWindow);
        }
        if (path.startsWith("/api/ai/")) {
            return new LimitPolicy("ai", aiLimitPerWindow);
        }
        if (path.startsWith("/api/auth/")) {
            return new LimitPolicy("auth", authLimitPerWindow);
        }
        if (path.startsWith("/api/bookings/") && !"GET".equalsIgnoreCase(method)) {
            return new LimitPolicy("booking-write", bookingWriteLimitPerWindow);
        }

        return null;
    }

    private String extractClientKey(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            int comma = forwarded.indexOf(',');
            return (comma > 0 ? forwarded.substring(0, comma) : forwarded).trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }
        return request.getRemoteAddr() == null ? "unknown" : request.getRemoteAddr();
    }
}
