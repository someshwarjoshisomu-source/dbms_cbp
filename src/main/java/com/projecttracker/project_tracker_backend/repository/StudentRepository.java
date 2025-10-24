package com.projecttracker.project_tracker_backend.repository;

import com.projecttracker.project_tracker_backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByEmailAndPasswordHash(String email, String passwordHash);
}
