package com.projecttracker.project_tracker_backend.service;

import com.projecttracker.project_tracker_backend.config.JwtUtil;
import com.projecttracker.project_tracker_backend.dto.AuthResponse;
import com.projecttracker.project_tracker_backend.dto.RegisterRequest;
import com.projecttracker.project_tracker_backend.model.Company;
import com.projecttracker.project_tracker_backend.model.Mentor;
import com.projecttracker.project_tracker_backend.model.Student;
import com.projecttracker.project_tracker_backend.repository.CompanyRepository;
import com.projecttracker.project_tracker_backend.repository.MentorRepository;
import com.projecttracker.project_tracker_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ==========================================
    // REGISTRATION
    // ==========================================

    @Transactional
    public AuthResponse registerStudent(RegisterRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered as a student.");
        }

        Student student = new Student();
        student.setFirstName(request.getFirstName() != null ? request.getFirstName().trim() : "");
        student.setLastName(request.getLastName() != null ? request.getLastName().trim() : "");
        student.setEmail(request.getEmail().trim().toLowerCase());
        student.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        student.setMajor(request.getMajor());
        student.setGraduationYear(request.getGraduationYear() != null ? request.getGraduationYear() : 0);

        Student saved = studentRepository.save(student);
        String token = jwtUtil.generateToken(saved.getEmail(), "STUDENT");

        return AuthResponse.builder()
                .token(token)
                .role("student")
                .name(saved.getFirstName() + " " + saved.getLastName())
                .email(saved.getEmail())
                .studentId(saved.getStudentId())
                .message("✅ Student Registration Successful")
                .build();
    }

    @Transactional
    public AuthResponse registerMentor(RegisterRequest request) {
        if (mentorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered as a mentor.");
        }

        Mentor mentor = new Mentor();
        mentor.setFirstName(request.getFirstName() != null ? request.getFirstName().trim() : "");
        mentor.setLastName(request.getLastName() != null ? request.getLastName().trim() : "");
        mentor.setEmail(request.getEmail().trim().toLowerCase());
        mentor.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        mentor.setDepartment(request.getDepartment());
        mentor.setDesignation(request.getDesignation());

        Mentor saved = mentorRepository.save(mentor);
        String token = jwtUtil.generateToken(saved.getEmail(), "MENTOR");

        return AuthResponse.builder()
                .token(token)
                .role("mentor")
                .name(saved.getFirstName() + " " + saved.getLastName())
                .email(saved.getEmail())
                .mentorId(saved.getMentorId())
                .message("✅ Mentor Registration Successful")
                .build();
    }

    @Transactional
    public AuthResponse registerCompany(RegisterRequest request) {
        if (companyRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered as a company.");
        }

        Company company = new Company();
        company.setCompanyName(request.getCompanyName() != null ? request.getCompanyName().trim() : (request.getFirstName() + " " + request.getLastName()).trim());
        company.setEmail(request.getEmail().trim().toLowerCase());
        company.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        company.setContactPerson(request.getContactPerson());
        company.setContactNumber(request.getContactNumber());
        company.setAddress(request.getAddress());
        company.setWebsiteUrl(request.getWebsiteUrl());

        Company saved = companyRepository.save(company);
        String token = jwtUtil.generateToken(saved.getEmail(), "COMPANY");

        return AuthResponse.builder()
                .token(token)
                .role("company")
                .name(saved.getCompanyName())
                .email(saved.getEmail())
                .companyId(saved.getCompanyId())
                .message("✅ Company Registration Successful")
                .build();
    }

    // ==========================================
    // LOGIN
    // ==========================================

    public Optional<AuthResponse> loginStudent(String email, String rawPassword) {
        Optional<Student> studentOpt = studentRepository.findByEmail(email.trim().toLowerCase());
        if (studentOpt.isPresent()) {
            Student s = studentOpt.get();
            if (passwordEncoder.matches(rawPassword, s.getPasswordHash())) {
                String token = jwtUtil.generateToken(s.getEmail(), "STUDENT");
                return Optional.of(AuthResponse.builder()
                        .token(token)
                        .role("student")
                        .name(s.getFirstName())
                        .email(s.getEmail())
                        .studentId(s.getStudentId())
                        .message("✅ Student Login Successful")
                        .build());
            }
        }
        return Optional.empty();
    }

    public Optional<AuthResponse> loginMentor(String email, String rawPassword) {
        Optional<Mentor> mentorOpt = mentorRepository.findByEmail(email.trim().toLowerCase());
        if (mentorOpt.isPresent()) {
            Mentor m = mentorOpt.get();
            if (passwordEncoder.matches(rawPassword, m.getPasswordHash())) {
                String token = jwtUtil.generateToken(m.getEmail(), "MENTOR");
                return Optional.of(AuthResponse.builder()
                        .token(token)
                        .role("mentor")
                        .name(m.getFirstName())
                        .email(m.getEmail())
                        .mentorId(m.getMentorId())
                        .message("✅ Mentor Login Successful")
                        .build());
            }
        }
        return Optional.empty();
    }

    public Optional<AuthResponse> loginCompany(String email, String rawPassword) {
        Optional<Company> companyOpt = companyRepository.findByEmail(email.trim().toLowerCase());
        if (companyOpt.isPresent()) {
            Company c = companyOpt.get();
            if (passwordEncoder.matches(rawPassword, c.getPasswordHash())) {
                String token = jwtUtil.generateToken(c.getEmail(), "COMPANY");
                return Optional.of(AuthResponse.builder()
                        .token(token)
                        .role("company")
                        .name(c.getCompanyName())
                        .email(c.getEmail())
                        .companyId(c.getCompanyId())
                        .message("✅ Company Login Successful")
                        .build());
            }
        }
        return Optional.empty();
    }
}
