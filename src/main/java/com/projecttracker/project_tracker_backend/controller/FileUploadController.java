package com.projecttracker.project_tracker_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;

@RestController
@RequestMapping("/upload")
@CrossOrigin(origins = "http://localhost:5173")
public class FileUploadController {

    private static final String UPLOAD_DIR = "uploads/resumes/";

    @PostMapping("/resume")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            // create directory if it doesn’t exist
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            // unique file name
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);

            // save file
            file.transferTo(filePath);

            // return download path
            String fileUrl = "http://localhost:8080/" + UPLOAD_DIR + fileName;
            return ResponseEntity.ok().body("{\"url\": \"" + fileUrl + "\"}");
        } catch (IOException e) {
            return ResponseEntity.status(500)
                    .body("{\"error\": \"Failed to upload file: " + e.getMessage() + "\"}");
        }
    }
}
