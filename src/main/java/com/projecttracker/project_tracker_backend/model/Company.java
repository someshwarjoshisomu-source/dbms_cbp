package com.projecttracker.project_tracker_backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "company")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int companyId;

    @Column(nullable = false, length = 100)
    private String companyName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String passwordHash;

    @Column(length = 100)
    private String contactPerson;

    @Column(length = 15)
    private String contactNumber;

    @Column(length = 255)
    private String address;

    @Column(length = 255)
    private String websiteUrl;

    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Internship> internships;
}
