package com.projecttracker.project_tracker_backend.controller;

import com.projecttracker.project_tracker_backend.config.JwtUtil;
import com.projecttracker.project_tracker_backend.dto.LoginRequest;
import com.projecttracker.project_tracker_backend.model.Student;
import com.projecttracker.project_tracker_backend.model.Mentor;
import com.projecttracker.project_tracker_backend.model.Company;
import com.projecttracker.project_tracker_backend.repository.StudentRepository;
import com.projecttracker.project_tracker_backend.repository.MentorRepository;
import com.projecttracker.project_tracker_backend.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private MentorRepository mentorRepo;

    @Autowired
    private CompanyRepository companyRepo;

    @Autowired(required = false)
    private JwtUtil jwtUtil;

    // 🎓 STUDENT LOGIN
    @PostMapping("/student")
    public ResponseEntity<?> loginStudent(@RequestBody LoginRequest loginRequest) {
        Optional<Student> student = studentRepo.findByEmailAndPasswordHash(
                loginRequest.getEmail(), loginRequest.getPassword());

        if (student.isPresent()) {
            Student s = student.get();
            String token = (jwtUtil != null)
                    ? jwtUtil.generateToken(s.getEmail(), "STUDENT")
                    : "dummy-token";

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "studentId", s.getStudentId(),
                    "role", "student",
                    "name", s.getFirstName(),
                    "email", s.getEmail(),
                    "message", "✅ Student Login Successful"
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "❌ Invalid Student Credentials"
            ));
        }
    }

    // 🧑‍🏫 MENTOR LOGIN
    @PostMapping("/mentor")
    public ResponseEntity<?> loginMentor(@RequestBody LoginRequest loginRequest) {
        Optional<Mentor> mentor = mentorRepo.findByEmailAndPasswordHash(
                loginRequest.getEmail(), loginRequest.getPassword());

        if (mentor.isPresent()) {
            Mentor m = mentor.get();
            String token = (jwtUtil != null)
                    ? jwtUtil.generateToken(m.getEmail(), "MENTOR")
                    : "dummy-token";

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "mentorId", m.getMentorId(),
                    "role", "mentor",
                    "name", m.getFirstName(),
                    "email", m.getEmail(),
                    "message", "✅ Mentor Login Successful"
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "❌ Invalid Mentor Credentials"
            ));
        }
    }

    // 🏢 COMPANY LOGIN
    @PostMapping("/company")
    public ResponseEntity<?> loginCompany(@RequestBody LoginRequest loginRequest) {
        Optional<Company> company = companyRepo.findByEmailAndPasswordHash(
                loginRequest.getEmail(), loginRequest.getPassword()
        );

        if (company.isPresent()) {
            Company c = company.get();
            String token = (jwtUtil != null)
                    ? jwtUtil.generateToken(c.getEmail(), "COMPANY")
                    : "dummy-token";

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "companyId", c.getCompanyId(),
                    "role", "company",
                    "name", c.getCompanyName(),
                    "email", c.getEmail(),
                    "message", "✅ Company Login Successful"
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "❌ Invalid Company Credentials"
            ));
        }
    }
}
