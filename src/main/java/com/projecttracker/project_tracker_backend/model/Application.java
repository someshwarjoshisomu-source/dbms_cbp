package com.projecttracker.project_tracker_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "application",
        uniqueConstraints = @UniqueConstraint(name = "uk_student_internship", columnNames = {"student_id", "internship_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int applicationId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "internship_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Internship internship;

    @Column(nullable = false)
    private LocalDateTime applicationDate = LocalDateTime.now();

    @Column(nullable = false, length = 20)
    private String status = "Applied"; // Applied, Interviewing, Offered, Rejected, Accepted

    @Column(length = 255)
    private String resumeUrl;

    @Column(length = 255)
    private String remarks;
}
