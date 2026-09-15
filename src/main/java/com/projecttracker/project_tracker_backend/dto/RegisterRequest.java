package com.projecttracker.project_tracker_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    // Common
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    // Student & Mentor fields
    private String firstName;
    private String lastName;

    // Student specific
    private String major;
    private Integer graduationYear;

    // Mentor specific
    private String department;
    private String designation;

    // Company specific
    private String companyName;
    private String contactPerson;
    private String contactNumber;
    private String address;
    private String websiteUrl;
}
