package com.projecttracker.project_tracker_backend.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Service
public class RateLimiterService {

    private final ConcurrentHashMap<String, ConcurrentLinkedQueue<Long>> requestLog = new ConcurrentHashMap<>();

    // Max 10 attempts per minute per IP
    private static final int MAX_REQUESTS = 10;
    private static final long TIME_WINDOW_MS = 60 * 1000L;

    public boolean tryAcquire(String clientIp) {
        long now = Instant.now().toEpochMilli();
        ConcurrentLinkedQueue<Long> timestamps = requestLog.computeIfAbsent(clientIp, k -> new ConcurrentLinkedQueue<>());

        // Evict timestamps older than window
        while (!timestamps.isEmpty() && now - timestamps.peek() > TIME_WINDOW_MS) {
            timestamps.poll();
        }

        int limit = ("127.0.0.1".equals(clientIp) || "0:0:0:0:0:0:0:1".equals(clientIp)) ? 150 : MAX_REQUESTS;
        if (timestamps.size() >= limit) {
            return false; // Rate limit exceeded
        }

        timestamps.add(now);
        return true;
    }
}
