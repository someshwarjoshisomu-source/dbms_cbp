package com.projecttracker.project_tracker_backend.controller;

import com.projecttracker.project_tracker_backend.model.Evaluation;
import com.projecttracker.project_tracker_backend.model.Mentor;
import com.projecttracker.project_tracker_backend.model.Student;
import com.projecttracker.project_tracker_backend.repository.EvaluationRepository;
import com.projecttracker.project_tracker_backend.repository.MentorRepository;
import com.projecttracker.project_tracker_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/evaluations")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EvaluationController {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MentorRepository mentorRepository;

    // ✅ 1️⃣ Add or update evaluation
    @PostMapping
    public ResponseEntity<Map<String, Object>> addOrUpdateEvaluation(@RequestBody Evaluation evaluation) {
        Map<String, Object> response = new HashMap<>();
        try {
            Student student = studentRepository.findById(evaluation.getStudent().getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            Mentor mentor = mentorRepository.findById(evaluation.getMentor().getMentorId())
                    .orElseThrow(() -> new RuntimeException("Mentor not found"));

            evaluation.setStudent(student);
            evaluation.setMentor(mentor);
            evaluation.setEvaluationDate(LocalDate.now());

            Evaluation saved = evaluationRepository.save(evaluation);

            response.put("message", "✅ Evaluation submitted successfully");
            response.put("evaluationId", saved.getEvaluationId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "❌ Failed to save evaluation");
            response.put("details", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ✅ 2️⃣ Get all evaluations
    @GetMapping
    public ResponseEntity<List<Evaluation>> getAllEvaluations() {
        return ResponseEntity.ok(evaluationRepository.findAll());
    }

    // ✅ 3️⃣ Get evaluations by student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Evaluation>> getEvaluationsByStudent(@PathVariable int studentId) {
        return ResponseEntity.ok(evaluationRepository.findByStudentStudentId(studentId));
    }

    // ✅ 4️⃣ Get evaluations by mentor
    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<List<Evaluation>> getEvaluationsByMentor(@PathVariable int mentorId) {
        return ResponseEntity.ok(evaluationRepository.findByMentorMentorId(mentorId));
    }

    // ✅ 5️⃣ Update evaluation (marks or remarks)
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateEvaluation(@PathVariable int id, @RequestBody Evaluation updatedEvaluation) {
        Map<String, String> response = new HashMap<>();
        return evaluationRepository.findById(id)
                .map(evaluation -> {
                    evaluation.setMarksObtained(updatedEvaluation.getMarksObtained());
                    evaluation.setMaxMarks(updatedEvaluation.getMaxMarks());
                    evaluation.setRemarks(updatedEvaluation.getRemarks());
                    evaluation.setEvaluationDate(LocalDate.now());
                    evaluationRepository.save(evaluation);
                    response.put("message", "✅ Evaluation updated successfully");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(404).body(Map.of("error", "❌ Evaluation not found")));
    }

    // ✅ 6️⃣ Delete evaluation
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEvaluation(@PathVariable int id) {
        Map<String, String> response = new HashMap<>();
        if (!evaluationRepository.existsById(id)) {
            response.put("error", "❌ Evaluation not found");
            return ResponseEntity.status(404).body(response);
        }
        evaluationRepository.deleteById(id);
        response.put("message", "✅ Evaluation deleted successfully");
        return ResponseEntity.ok(response);
    }
}
