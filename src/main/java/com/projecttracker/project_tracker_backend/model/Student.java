package com.projecttracker.project_tracker_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Student")
@Data                   // Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor      // Generates a no-arg constructor
@AllArgsConstructor     // Generates a full-arg constructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int studentId;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(length = 100)
    private String major;

    @Column
    private int graduationYear;

    @Column(nullable = false)
    private String passwordHash;

    @Column
    private Integer mentorId; // Nullable, in case mentor not yet assigned
}
