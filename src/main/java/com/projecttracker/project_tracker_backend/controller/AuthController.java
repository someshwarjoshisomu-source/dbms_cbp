package com.projecttracker.project_tracker_backend.controller;

import com.projecttracker.project_tracker_backend.dto.AuthResponse;
import com.projecttracker.project_tracker_backend.dto.LoginRequest;
import com.projecttracker.project_tracker_backend.dto.RegisterRequest;
import com.projecttracker.project_tracker_backend.service.AuthService;
import com.projecttracker.project_tracker_backend.service.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private RateLimiterService rateLimiterService;

    private String extractClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    // ==========================================
    // REGISTRATION ENDPOINTS
    // ==========================================

    @PostMapping({"/auth/register/{role}", "/register/{role}"})
    public ResponseEntity<?> register(
            @PathVariable String role,
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest) {

        String ip = extractClientIp(httpRequest);
        if (!rateLimiterService.tryAcquire(ip)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", "Too many requests. Please wait a minute before trying again."));
        }

        try {
            AuthResponse response;
            switch (role.toLowerCase()) {
                case "student":
                    response = authService.registerStudent(request);
                    break;
                case "mentor":
                    response = authService.registerMentor(request);
                    break;
                case "company":
                    response = authService.registerCompany(request);
                    break;
                default:
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid role: " + role));
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ==========================================
    // LOGIN ENDPOINTS (Supports /auth/login and legacy /login)
    // ==========================================

    @PostMapping({"/auth/login/{role}", "/login/{role}"})
    public ResponseEntity<?> login(
            @PathVariable String role,
            @RequestBody LoginRequest loginRequest,
            HttpServletRequest httpRequest) {

        String ip = extractClientIp(httpRequest);
        if (!rateLimiterService.tryAcquire(ip)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", "Too many failed login attempts. Please wait a minute before trying again."));
        }

        Optional<AuthResponse> responseOpt;
        switch (role.toLowerCase()) {
            case "student":
                responseOpt = authService.loginStudent(loginRequest.getEmail(), loginRequest.getPassword());
                break;
            case "mentor":
                responseOpt = authService.loginMentor(loginRequest.getEmail(), loginRequest.getPassword());
                break;
            case "company":
                responseOpt = authService.loginCompany(loginRequest.getEmail(), loginRequest.getPassword());
                break;
            default:
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid role: " + role));
        }

        if (responseOpt.isPresent()) {
            return ResponseEntity.ok(responseOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "❌ Invalid " + role + " credentials"));
        }
    }
}
