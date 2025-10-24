package com.projecttracker.project_tracker_backend.controller;

import com.projecttracker.project_tracker_backend.model.Internship;
import com.projecttracker.project_tracker_backend.model.Company;
import com.projecttracker.project_tracker_backend.repository.CompanyRepository;
import com.projecttracker.project_tracker_backend.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/internships")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class InternshipController {

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private CompanyRepository companyRepository;

    // ✅ 1️⃣ Create Internship
    @PostMapping
    public ResponseEntity<?> createInternship(@RequestBody Internship internship) {
        try {
            if (internship.getCompany() == null || internship.getCompany().getCompanyId() == 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Company ID missing in request");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Company company = companyRepository.findById(internship.getCompany().getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Company not found"));

            internship.setCompany(company);
            internship.setStatus(internship.getStatus() == null ? "Active" : internship.getStatus());

            Internship saved = internshipRepository.save(internship);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // ✅ 2️⃣ Get all active internships (for students)
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllInternships() {
        List<Map<String, Object>> list = internshipRepository.findAll()
                .stream()
                .filter(i -> "Active".equalsIgnoreCase(i.getStatus()))
                .map(i -> {
                    Map<String, Object> dto = new HashMap<>();
                    dto.put("internshipId", i.getInternshipId());
                    dto.put("title", i.getTitle());
                    dto.put("description", i.getDescription());
                    dto.put("duration", i.getDuration());
                    dto.put("stipend", i.getStipend());
                    dto.put("status", i.getStatus());
                    dto.put("startDate", i.getStartDate());
                    dto.put("endDate", i.getEndDate());
                    dto.put("companyName",
                            i.getCompany() != null ? i.getCompany().getCompanyName() : "Unknown");
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    // ✅ 3️⃣ Get internships by company (for company dashboard)
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Internship>> getInternshipsByCompany(@PathVariable int companyId) {
        List<Internship> list = internshipRepository.findByCompanyCompanyId(companyId);
        return ResponseEntity.ok(list);
    }

    // ✅ 4️⃣ Get internship by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getInternshipById(@PathVariable int id) {
        Optional<Internship> internship = internshipRepository.findById(id);
        if (internship.isPresent()) {
            return ResponseEntity.ok(internship.get());
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internship not found");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // ✅ 5️⃣ Update internship details
    @PutMapping("/{id}")
    public ResponseEntity<?> updateInternship(@PathVariable int id, @RequestBody Internship updatedInternship) {
        Optional<Internship> existing = internshipRepository.findById(id);

        if (existing.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internship not found");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        Internship internship = existing.get();
        internship.setTitle(updatedInternship.getTitle());
        internship.setDescription(updatedInternship.getDescription());
        internship.setDuration(updatedInternship.getDuration());
        internship.setStipend(updatedInternship.getStipend());
        internship.setStatus(updatedInternship.getStatus());
        internship.setStartDate(updatedInternship.getStartDate());
        internship.setEndDate(updatedInternship.getEndDate());

        Internship updated = internshipRepository.save(internship);
        return ResponseEntity.ok(updated);
    }

    // ✅ 6️⃣ Delete internship
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteInternship(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        if (!internshipRepository.existsById(id)) {
            response.put("error", "Internship not found");
            return ResponseEntity.badRequest().body(response);
        }
        internshipRepository.deleteById(id);
        response.put("message", "🗑️ Internship deleted successfully.");
        return ResponseEntity.ok(response);
    }
}
