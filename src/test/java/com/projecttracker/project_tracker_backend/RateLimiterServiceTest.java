package com.projecttracker.project_tracker_backend;

import com.projecttracker.project_tracker_backend.service.RateLimiterService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RateLimiterServiceTest {

    private final RateLimiterService rateLimiterService = new RateLimiterService();

    @Test
    void testRateLimiterAllowsUnderThreshold() {
        String testIp = "192.168.1.100";
        for (int i = 0; i < 10; i++) {
            assertTrue(rateLimiterService.tryAcquire(testIp), "Request " + i + " should be allowed");
        }
    }

    @Test
    void testRateLimiterRejectsOverThreshold() {
        String testIp = "192.168.1.200";
        for (int i = 0; i < 10; i++) {
            rateLimiterService.tryAcquire(testIp);
        }
        // 11th request from non-loopback IP must be throttled
        assertFalse(rateLimiterService.tryAcquire(testIp), "11th request should be rejected by rate limiter");
    }
}
