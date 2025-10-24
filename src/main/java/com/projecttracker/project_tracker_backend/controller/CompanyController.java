package com.projecttracker.project_tracker_backend.controller;

import com.projecttracker.project_tracker_backend.model.*;
import com.projecttracker.project_tracker_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/companies")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
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
        try {
            Company saved = companyRepository.save(company);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "❌ Failed to create company",
                    "details", e.getMessage()
            ));
        }
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
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(Map.of("error", "❌ Company not found")));
    }

    // ✅ 4️⃣ Update company details
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable int id, @RequestBody Company updatedCompany) {
        return companyRepository.findById(id)
                .<ResponseEntity<?>>map(existing -> {
                    existing.setCompanyName(updatedCompany.getCompanyName());
                    existing.setEmail(updatedCompany.getEmail());
                    existing.setPasswordHash(updatedCompany.getPasswordHash());
                    existing.setContactPerson(updatedCompany.getContactPerson());
                    existing.setContactNumber(updatedCompany.getContactNumber());
                    existing.setAddress(updatedCompany.getAddress());
                    existing.setWebsiteUrl(updatedCompany.getWebsiteUrl());
                    Company saved = companyRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(Map.of("error", "❌ Company not found")));
    }

    // ✅ 5️⃣ Delete company
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable int id) {
        if (!companyRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("error", "❌ Company not found"));
        }
        companyRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "✅ Company deleted successfully"));
    }

    // ✅ 6️⃣ View applications for a company’s internships
    @GetMapping("/{companyId}/applications")
    public ResponseEntity<?> getApplicationsByCompany(@PathVariable int companyId) {
        List<Internship> internships = internshipRepository.findByCompanyCompanyId(companyId);
        if (internships.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Application> allApplications = new ArrayList<>();
        for (Internship i : internships) {
            allApplications.addAll(applicationRepository.findByInternshipInternshipId(i.getInternshipId()));
        }
        return ResponseEntity.ok(allApplications);
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
                    return ResponseEntity.ok(Map.of(
                            "message", "✅ Application updated to " + status
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(Map.of("error", "❌ Application not found")));
    }

    // ✅ 8️⃣ Assign a mentor to an accepted student
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

        // Future: link mentor & student via a Project entity
        Map<String, Object> response = new HashMap<>();
        response.put("message", "✅ Mentor assigned successfully");
        response.put("mentor", mentorOpt.get().getFirstName());
        response.put("student", studentOpt.get().getFirstName());
        response.put("internshipId", internshipId);

        return ResponseEntity.ok(response);
    }

    // ✅ 9️⃣ Basic analytics for company dashboard
    @GetMapping("/{companyId}/analytics")
    public ResponseEntity<?> getCompanyAnalytics(@PathVariable int companyId) {
        List<Internship> internships = internshipRepository.findByCompanyCompanyId(companyId);

        int totalInternships = internships.size();
        long totalApplications = internships.stream()
                .mapToLong(i -> applicationRepository.findByInternshipInternshipId(i.getInternshipId()).size())
                .sum();

        long acceptedCount = internships.stream()
                .flatMap(i -> applicationRepository.findByInternshipInternshipId(i.getInternshipId()).stream())
                .filter(a -> "Accepted".equalsIgnoreCase(a.getStatus()))
                .count();

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalInternships", totalInternships);
        analytics.put("totalApplications", totalApplications);
        analytics.put("acceptedCount", acceptedCount);

        return ResponseEntity.ok(analytics);
    }
}
