package com.projecttracker.project_tracker_backend.controller;

import com.projecttracker.project_tracker_backend.model.Student;
import com.projecttracker.project_tracker_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students") // allows your React app to call this API
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    // ✅ 1️⃣ Create a new student
    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    // ✅ 2️⃣ Get all students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // ✅ 3️⃣ Get a student by ID
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable int id) {
        return studentRepository.findById(id).orElse(null);
    }

    // ✅ 4️⃣ Delete a student
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable int id) {
        studentRepository.deleteById(id);
        return "Student with ID " + id + " has been deleted.";
    }

    // ✅ 5️⃣ Update a student’s details
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable int id, @RequestBody Student updatedStudent) {
        return studentRepository.findById(id)
                .map(student -> {
                    student.setFirstName(updatedStudent.getFirstName());
                    student.setLastName(updatedStudent.getLastName());
                    student.setEmail(updatedStudent.getEmail());
                    student.setMajor(updatedStudent.getMajor());
                    student.setGraduationYear(updatedStudent.getGraduationYear());
                    student.setPasswordHash(updatedStudent.getPasswordHash());
                    student.setMentorId(updatedStudent.getMentorId());
                    return studentRepository.save(student);
                })
                .orElse(null);
    }
}
