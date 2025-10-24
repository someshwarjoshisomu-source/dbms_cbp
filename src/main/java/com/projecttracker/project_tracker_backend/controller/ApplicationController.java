package com.projecttracker.project_tracker_backend.controller;

import com.projecttracker.project_tracker_backend.model.Application;
import com.projecttracker.project_tracker_backend.model.Internship;
import com.projecttracker.project_tracker_backend.model.Student;
import com.projecttracker.project_tracker_backend.repository.ApplicationRepository;
import com.projecttracker.project_tracker_backend.repository.InternshipRepository;
import com.projecttracker.project_tracker_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    // ✅ 1️⃣ Apply for internship
    @PostMapping
    public ResponseEntity<?> applyForInternship(@RequestBody Application application) {
        try {
            Student student = studentRepository.findById(application.getStudent().getStudentId())
                    .orElseThrow(() -> new RuntimeException("Invalid student ID"));
            Internship internship = internshipRepository.findById(application.getInternship().getInternshipId())
                    .orElseThrow(() -> new RuntimeException("Invalid internship ID"));

            boolean alreadyApplied = applicationRepository
                    .existsByStudentStudentIdAndInternshipInternshipId(student.getStudentId(), internship.getInternshipId());

            if (alreadyApplied) {
                return ResponseEntity.badRequest().body(Map.of("error", "❌ Already applied for this internship."));
            }

            application.setStudent(student);
            application.setInternship(internship);
            application.setStatus("Applied");
            application.setApplicationDate(LocalDateTime.now());
            application.setResumeUrl(application.getResumeUrl()); // keep the uploaded resume link


            applicationRepository.save(application);
            return ResponseEntity.ok(Map.of("message", "✅ Application submitted successfully."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ 2️⃣ Get all applications
    @GetMapping
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    // ✅ 3️⃣ Get applications by student
    @GetMapping("/student/{studentId}")
    public List<Application> getApplicationsByStudent(@PathVariable int studentId) {
        return applicationRepository.findByStudentStudentId(studentId);
    }

    // ✅ 4️⃣ Get applications by internship
    @GetMapping("/internship/{internshipId}")
    public List<Application> getApplicationsByInternship(@PathVariable int internshipId) {
        return applicationRepository.findByInternshipInternshipId(internshipId);
    }

    // ✅ 5️⃣ Update application status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable int id, @RequestParam String status) {
        return applicationRepository.findById(id)
                .map(app -> {
                    app.setStatus(status);
                    applicationRepository.save(app);
                    return ResponseEntity.ok(Map.of("message", "✅ Status updated to " + status));
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("error", "Application not found")));
    }

    // ✅ 6️⃣ Delete an application
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable int id) {
        if (!applicationRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Application not found"));
        }
        applicationRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "🗑️ Application deleted successfully."));
    }
}
