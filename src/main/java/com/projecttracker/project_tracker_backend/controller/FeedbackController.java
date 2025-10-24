package com.projecttracker.project_tracker_backend.controller;

import com.projecttracker.project_tracker_backend.model.Feedback;
import com.projecttracker.project_tracker_backend.model.Mentor;
import com.projecttracker.project_tracker_backend.model.Student;
import com.projecttracker.project_tracker_backend.repository.FeedbackRepository;
import com.projecttracker.project_tracker_backend.repository.MentorRepository;
import com.projecttracker.project_tracker_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MentorRepository mentorRepository;

    // ✅ 1️⃣ Add feedback
    @PostMapping
    public Feedback addFeedback(@RequestBody Feedback feedback) {
        Student student = studentRepository.findById(feedback.getStudent().getStudentId()).orElse(null);
        Mentor mentor = null;

        if (feedback.getMentor() != null && feedback.getMentor().getMentorId() != 0) {
            mentor = mentorRepository.findById(feedback.getMentor().getMentorId()).orElse(null);
        }

        if (student == null) {
            throw new RuntimeException("Invalid Student ID");
        }

        feedback.setStudent(student);
        feedback.setMentor(mentor);
        return feedbackRepository.save(feedback);
    }

    // ✅ 2️⃣ Get all feedback
    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    // ✅ 3️⃣ Get feedback by student
    @GetMapping("/student/{studentId}")
    public List<Feedback> getFeedbackByStudent(@PathVariable int studentId) {
        return feedbackRepository.findByStudentStudentId(studentId);
    }

    // ✅ 4️⃣ Get feedback by mentor
    @GetMapping("/mentor/{mentorId}")
    public List<Feedback> getFeedbackByMentor(@PathVariable int mentorId) {
        return feedbackRepository.findByMentorMentorId(mentorId);
    }

    // ✅ 5️⃣ Delete feedback
    @DeleteMapping("/{id}")
    public String deleteFeedback(@PathVariable int id) {
        feedbackRepository.deleteById(id);
        return "Feedback with ID " + id + " deleted successfully.";
    }
}
