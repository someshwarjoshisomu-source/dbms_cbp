package com.projecttracker.project_tracker_backend.repository;

import com.projecttracker.project_tracker_backend.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {
    Optional<Company> findByEmailAndPasswordHash(String email, String passwordHash);
}
