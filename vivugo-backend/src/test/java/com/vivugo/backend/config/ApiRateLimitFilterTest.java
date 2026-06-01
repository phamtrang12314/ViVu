package com.vivugo.backend.config;

import jakarta.servlet.ServletException;
import java.io.IOException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ApiRateLimitFilterTest {

    @Test
    void blocksRequestWhenAiLimitExceeded() throws ServletException, IOException {
        ApiRateLimitFilter filter = new ApiRateLimitFilter(true, 60, 2, 40, 30);

        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/ai/chat");
        request.setRemoteAddr("10.0.0.8");

        MockHttpServletResponse firstResponse = new MockHttpServletResponse();
        filter.doFilter(request, firstResponse, new MockFilterChain());
        assertEquals(200, firstResponse.getStatus());

        MockHttpServletResponse secondResponse = new MockHttpServletResponse();
        filter.doFilter(request, secondResponse, new MockFilterChain());
        assertEquals(200, secondResponse.getStatus());

        MockHttpServletResponse thirdResponse = new MockHttpServletResponse();
        filter.doFilter(request, thirdResponse, new MockFilterChain());
        assertEquals(429, thirdResponse.getStatus());
        assertTrue(thirdResponse.getContentAsString().contains("Too many requests"));
    }
}
