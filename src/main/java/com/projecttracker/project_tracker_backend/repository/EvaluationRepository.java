package com.projecttracker.project_tracker_backend.repository;

import com.projecttracker.project_tracker_backend.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Integer> {
    List<Evaluation> findByStudentStudentId(int studentId);
    List<Evaluation> findByMentorMentorId(int mentorId);
}
