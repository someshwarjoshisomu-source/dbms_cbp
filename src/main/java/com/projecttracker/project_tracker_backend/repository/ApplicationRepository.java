package com.projecttracker.project_tracker_backend.repository;

import com.projecttracker.project_tracker_backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    List<Application> findByStudentStudentId(int studentId);
    List<Application> findByInternshipInternshipId(int internshipId);
    List<Application> findByStatus(String status);
    boolean existsByStudentStudentIdAndInternshipInternshipId(int studentId, int internshipId);

    // Optimized single-query methods for company analytics and application views
    List<Application> findByInternshipCompanyCompanyId(int companyId);
    long countByInternshipCompanyCompanyId(int companyId);
    long countByInternshipCompanyCompanyIdAndStatusIgnoreCase(int companyId, String status);
}
