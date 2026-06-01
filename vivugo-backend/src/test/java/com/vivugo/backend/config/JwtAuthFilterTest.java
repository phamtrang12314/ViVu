package com.vivugo.backend.config;

import com.vivugo.backend.service.JwtService;
import jakarta.servlet.ServletException;
import java.io.IOException;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JwtAuthFilterTest {

    @AfterEach
    void cleanUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void setsAuthenticationForValidJwtToken() throws ServletException, IOException {
        JwtService jwtService = mock(JwtService.class);
        UserDetailsService userDetailsService = mock(UserDetailsService.class);
        JwtAuthFilter filter = new JwtAuthFilter(jwtService, userDetailsService);

        String token = "valid-token";
        UserDetails adminUser = new User(
                "0900000000",
                "password",
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        when(jwtService.extractUsername(token)).thenReturn("0900000000");
        when(userDetailsService.loadUserByUsername("0900000000")).thenReturn(adminUser);
        when(jwtService.isTokenValid(token, adminUser)).thenReturn(true);

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/admin/dashboard/stats");
        request.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, new MockFilterChain());

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("0900000000", SecurityContextHolder.getContext().getAuthentication().getName());
        assertEquals(
                "ROLE_ADMIN",
                SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next().getAuthority()
        );
    }
}
