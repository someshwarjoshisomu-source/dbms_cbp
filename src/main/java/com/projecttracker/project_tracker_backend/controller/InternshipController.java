package com.projecttracker.project_tracker_backend.controller;

import com.projecttracker.project_tracker_backend.model.Company;
import com.projecttracker.project_tracker_backend.model.Internship;
import com.projecttracker.project_tracker_backend.repository.CompanyRepository;
import com.projecttracker.project_tracker_backend.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/internships")
public class InternshipController {

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private CompanyRepository companyRepository;

    // ✅ 1️⃣ Create Internship (Evicts cache)
    @PostMapping
    @CacheEvict(value = "internships", allEntries = true)
    public ResponseEntity<?> createInternship(@RequestBody Internship internship) {
        if (internship.getCompany() == null || internship.getCompany().getCompanyId() == 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Company ID missing in request"));
        }

        Company company = companyRepository.findById(internship.getCompany().getCompanyId())
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + internship.getCompany().getCompanyId()));

        internship.setCompany(company);
        internship.setStatus(internship.getStatus() == null ? "Active" : internship.getStatus());

        Internship saved = internshipRepository.save(internship);
        return ResponseEntity.ok(saved);
    }

    // ✅ 2️⃣ Get all active internships (Cached in Caffeine in-memory cache)
    @GetMapping
    @Cacheable(value = "internships")
    public ResponseEntity<List<Map<String, Object>>> getAllInternships() {
        List<Map<String, Object>> list = internshipRepository.findByStatusIgnoreCase("Active")
                .stream()
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
        return internshipRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Internship not found with ID: " + id)));
    }

    // ✅ 5️⃣ Update internship details (Evicts cache)
    @PutMapping("/{id}")
    @CacheEvict(value = "internships", allEntries = true)
    public ResponseEntity<?> updateInternship(@PathVariable int id, @RequestBody Internship updatedInternship) {
        return internshipRepository.findById(id)
                .<ResponseEntity<?>>map(internship -> {
                    internship.setTitle(updatedInternship.getTitle());
                    internship.setDescription(updatedInternship.getDescription());
                    internship.setDuration(updatedInternship.getDuration());
                    internship.setStipend(updatedInternship.getStipend());
                    internship.setStatus(updatedInternship.getStatus());
                    internship.setStartDate(updatedInternship.getStartDate());
                    internship.setEndDate(updatedInternship.getEndDate());
                    Internship saved = internshipRepository.save(internship);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Internship not found with ID: " + id)));
    }

    // ✅ 6️⃣ Delete internship (Evicts cache)
    @DeleteMapping("/{id}")
    @CacheEvict(value = "internships", allEntries = true)
    public ResponseEntity<Map<String, Object>> deleteInternship(@PathVariable int id) {
        if (!internshipRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("error", "Internship not found with ID: " + id));
        }
        internshipRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "🗑️ Internship deleted successfully."));
    }
}
