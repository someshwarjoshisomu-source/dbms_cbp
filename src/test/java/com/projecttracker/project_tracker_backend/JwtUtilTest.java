package com.projecttracker.project_tracker_backend;

import com.projecttracker.project_tracker_backend.config.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private final String secret = "4c2d9a7f8e1b3c5a6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c";

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", secret);
        ReflectionTestUtils.setField(jwtUtil, "validityMs", 3600000L);
        jwtUtil.init();
    }

    @Test
    void testTokenGenerationAndValidation() {
        String email = "test.student@google.com";
        String role = "STUDENT";

        String token = jwtUtil.generateToken(email, role);
        assertNotNull(token);
        assertTrue(jwtUtil.validateToken(token));
        assertEquals(email, jwtUtil.getUsernameFromToken(token));
        assertEquals(role, jwtUtil.getRoleFromToken(token));
    }

    @Test
    void testInvalidTokenRejection() {
        assertFalse(jwtUtil.validateToken("invalid.token.signature"));
    }
}
