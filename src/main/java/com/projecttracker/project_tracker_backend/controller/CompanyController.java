package com.projecttracker.project_tracker_backend.controller;

import com.projecttracker.project_tracker_backend.model.*;
import com.projecttracker.project_tracker_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private StudentRepository studentRepository;

    // ✅ 1️⃣ Create new company
    @PostMapping
    public ResponseEntity<?> createCompany(@RequestBody Company company) {
        Company saved = companyRepository.save(company);
        return ResponseEntity.ok(saved);
    }

    // ✅ 2️⃣ Get all companies
    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyRepository.findAll());
    }

    // ✅ 3️⃣ Get company by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable int id) {
        return companyRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "❌ Company not found with ID: " + id)));
    }

    // ✅ 4️⃣ Update company details
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable int id, @RequestBody Company updatedCompany) {
        return companyRepository.findById(id)
                .<ResponseEntity<?>>map(existing -> {
                    existing.setCompanyName(updatedCompany.getCompanyName());
                    existing.setEmail(updatedCompany.getEmail());
                    existing.setContactPerson(updatedCompany.getContactPerson());
                    existing.setContactNumber(updatedCompany.getContactNumber());
                    existing.setAddress(updatedCompany.getAddress());
                    existing.setWebsiteUrl(updatedCompany.getWebsiteUrl());
                    Company saved = companyRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "❌ Company not found with ID: " + id)));
    }

    // ✅ 5️⃣ Delete company
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable int id) {
        if (!companyRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("error", "❌ Company not found with ID: " + id));
        }
        companyRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "✅ Company deleted successfully"));
    }

    // ✅ 6️⃣ View applications for a company’s internships (Single SQL query, no N+1)
    @GetMapping("/{companyId}/applications")
    public ResponseEntity<?> getApplicationsByCompany(@PathVariable int companyId) {
        List<Application> applications = applicationRepository.findByInternshipCompanyCompanyId(companyId);
        return ResponseEntity.ok(applications);
    }

    // ✅ 7️⃣ Company accepts or rejects a student's application
    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable int applicationId,
            @RequestParam String status) {

        return applicationRepository.findById(applicationId)
                .<ResponseEntity<?>>map(app -> {
                    app.setStatus(status);
                    applicationRepository.save(app);
                    return ResponseEntity.ok(Map.of("message", "✅ Application updated to " + status));
                })
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "❌ Application not found with ID: " + applicationId)));
    }

    // ✅ 8️⃣ Assign a mentor to an accepted student (Persisted in DB)
    @PutMapping("/assign-mentor")
    public ResponseEntity<?> assignMentor(
            @RequestParam int mentorId,
            @RequestParam int studentId,
            @RequestParam(required = false) Integer internshipId) {

        Optional<Mentor> mentorOpt = mentorRepository.findById(mentorId);
        Optional<Student> studentOpt = studentRepository.findById(studentId);

        if (mentorOpt.isEmpty() || studentOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "❌ Mentor or Student not found"));
        }

        Student student = studentOpt.get();
        student.setMentorId(mentorId);
        studentRepository.save(student);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "✅ Mentor assigned successfully");
        response.put("mentor", mentorOpt.get().getFirstName() + " " + mentorOpt.get().getLastName());
        response.put("student", student.getFirstName() + " " + student.getLastName());
        response.put("mentorId", mentorId);
        response.put("studentId", studentId);
        if (internshipId != null) {
            response.put("internshipId", internshipId);
        }

        return ResponseEntity.ok(response);
    }

    // ✅ 9️⃣ Optimized analytics for company dashboard (Database-level counts, no N+1 loops)
    @GetMapping("/{companyId}/analytics")
    public ResponseEntity<?> getCompanyAnalytics(@PathVariable int companyId) {
        long totalInternships = internshipRepository.countByCompanyCompanyId(companyId);
        long totalApplications = applicationRepository.countByInternshipCompanyCompanyId(companyId);
        long acceptedCount = applicationRepository.countByInternshipCompanyCompanyIdAndStatusIgnoreCase(companyId, "Accepted");

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalInternships", totalInternships);
        analytics.put("totalApplications", totalApplications);
        analytics.put("acceptedCount", acceptedCount);

        return ResponseEntity.ok(analytics);
    }
}
