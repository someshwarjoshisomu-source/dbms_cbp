package com.projecttracker.project_tracker_backend.repository;

import com.projecttracker.project_tracker_backend.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByStudentStudentId(int studentId);
    List<Feedback> findByMentorMentorId(int mentorId);
}
