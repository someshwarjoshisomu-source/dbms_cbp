package com.projecttracker.project_tracker_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "Evaluation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int evaluationId;

    // ✅ Student being evaluated
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Student student;

    // ✅ Mentor evaluating
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Mentor mentor;

    // ✅ Optional link to a project
    @Column(name = "related_project_id")
    private Integer relatedProjectId;

    // ✅ Optional link to an internship
    @Column(name = "related_internship_id")
    private Integer relatedInternshipId;

    @Column(nullable = false)
    private double marksObtained;

    @Column(nullable = false)
    private double maxMarks;

    @Column(length = 255)
    private String remarks;

    @Column(nullable = false)
    private LocalDate evaluationDate = LocalDate.now();
}
