package com.projecttracker.project_tracker_backend.controller;

import com.projecttracker.project_tracker_backend.model.Application;
import com.projecttracker.project_tracker_backend.model.Mentor;
import com.projecttracker.project_tracker_backend.repository.ApplicationRepository;
import com.projecttracker.project_tracker_backend.repository.MentorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/mentors")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class MentorController {

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    // ✅ 1️⃣ Add new mentor
    @PostMapping
    public ResponseEntity<?> createMentor(@RequestBody Mentor mentor) {
        try {
            Mentor saved = mentorRepository.save(mentor);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "❌ Failed to create mentor");
            error.put("details", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    // ✅ 2️⃣ Get all mentors
    @GetMapping
    public ResponseEntity<List<Mentor>> getAllMentors() {
        return ResponseEntity.ok(mentorRepository.findAll());
    }

    // ✅ 3️⃣ Get mentor by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getMentorById(@PathVariable int id) {
        return mentorRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(Map.of("error", "❌ Mentor not found")));
    }

    // ✅ 4️⃣ Update mentor details (⚡ fixed type issue)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMentor(@PathVariable int id, @RequestBody Mentor updatedMentor) {
        Optional<Mentor> mentorOpt = mentorRepository.findById(id);
        if (mentorOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "❌ Mentor not found"));
        }

        Mentor existing = mentorOpt.get();
        existing.setFirstName(updatedMentor.getFirstName());
        existing.setLastName(updatedMentor.getLastName());
        existing.setEmail(updatedMentor.getEmail());
        existing.setPasswordHash(updatedMentor.getPasswordHash());
        existing.setDepartment(updatedMentor.getDepartment());
        existing.setDesignation(updatedMentor.getDesignation());

        Mentor saved = mentorRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    // ✅ 5️⃣ Delete mentor
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMentor(@PathVariable int id) {
        if (!mentorRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("error", "❌ Mentor not found"));
        }
        mentorRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "✅ Mentor deleted successfully"));
    }

    // 🚀 6️⃣ Get all applications (for mentor review dashboard)
    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationRepository.findAll());
    }

    // 🚀 7️⃣ Update application status (Accept / Reject)
    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable int applicationId,
            @RequestParam String status) {

        return applicationRepository.findById(applicationId)
                .<ResponseEntity<?>>map(app -> {
                    app.setStatus(status);
                    applicationRepository.save(app);
                    return ResponseEntity.ok(Map.of(
                            "message", "✅ Application " + applicationId + " updated to " + status
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(Map.of("error", "❌ Application not found")));
    }
}
