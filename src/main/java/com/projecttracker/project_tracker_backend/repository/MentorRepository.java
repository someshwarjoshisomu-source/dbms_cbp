package com.projecttracker.project_tracker_backend.repository;

import com.projecttracker.project_tracker_backend.model.Mentor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MentorRepository extends JpaRepository<Mentor, Integer> {
    Optional<Mentor> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Mentor> findByEmailAndPasswordHash(String email, String passwordHash);
}
