package com.projecttracker.project_tracker_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Mentor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mentor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int mentorId;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(length = 100)
    private String department;

    @Column(length = 50)
    private String designation;
}
