package com.projecttracker.project_tracker_backend.repository;

import com.projecttracker.project_tracker_backend.model.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Integer> {
    List<Internship> findByCompanyCompanyId(int companyId);
    List<Internship> findByStatus(String status);
    List<Internship> findByStatusIgnoreCase(String status);
}
