package com.projecttracker.project_tracker_backend.repository;

import com.projecttracker.project_tracker_backend.model.Mentor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MentorRepository extends JpaRepository<Mentor, Integer> {
    Optional<Mentor> findByEmailAndPasswordHash(String email, String passwordHash);
}
