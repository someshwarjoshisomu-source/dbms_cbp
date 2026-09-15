package com.projecttracker.project_tracker_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getApiStatus() {
        return ResponseEntity.ok(Map.of(
                "service", "Campus Project & Internship Tracker REST API",
                "status", "UP",
                "version", "1.0.0",
                "documentation", "/swagger-ui.html",
                "health", "/actuator/health",
                "message", "Backend is live and operating. Access the frontend UI via Vercel."
        ));
    }
}
