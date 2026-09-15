package com.projecttracker.project_tracker_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int feedbackId;

    // ✅ Student receiving feedback
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Student student;

    // ✅ Mentor giving feedback (optional — can be company later)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mentor_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Mentor mentor;

    // ✅ Optional — can link to a specific project
    @Column(name = "related_project_id")
    private Integer relatedProjectId;

    // ✅ Optional — can link to a specific internship
    @Column(name = "related_internship_id")
    private Integer relatedInternshipId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String feedbackText;

    @Column
    private Integer rating; // 1–5 rating scale

    @Column(nullable = false)
    private LocalDateTime feedbackDate = LocalDateTime.now();
}
