package com.projecttracker.project_tracker_backend.repository;

import com.projecttracker.project_tracker_backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Student> findByEmailAndPasswordHash(String email, String passwordHash); // Kept for legacy compatibility if needed
}
