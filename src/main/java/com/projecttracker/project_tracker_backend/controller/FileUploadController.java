package com.projecttracker.project_tracker_backend.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/upload")
public class FileUploadController {

    private static final Path UPLOAD_DIR = Paths.get("uploads", "resumes").toAbsolutePath().normalize();

    // Magic bytes for PDF: %PDF
    private static final byte[] PDF_MAGIC = new byte[]{0x25, 0x50, 0x44, 0x46};

    @PostMapping("/resume")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cannot upload an empty file."));
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || (!originalFilename.toLowerCase().endsWith(".pdf") &&
                !originalFilename.toLowerCase().endsWith(".doc") &&
                !originalFilename.toLowerCase().endsWith(".docx"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only PDF, DOC, and DOCX documents are allowed."));
        }

        // Lightweight magic-byte verification for PDF to prevent extension spoofing
        if (originalFilename.toLowerCase().endsWith(".pdf")) {
            try (InputStream is = file.getInputStream()) {
                byte[] header = new byte[4];
                int bytesRead = is.read(header);
                if (bytesRead < 4 || header[0] != PDF_MAGIC[0] || header[1] != PDF_MAGIC[1] ||
                        header[2] != PDF_MAGIC[2] || header[3] != PDF_MAGIC[3]) {
                    return ResponseEntity.badRequest().body(Map.of("error", "File content does not match a valid PDF document."));
                }
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to inspect file content."));
            }
        }

        try {
            Files.createDirectories(UPLOAD_DIR);

            // Sanitize file name with UUID to prevent path traversal & name collisions
            String sanitizedExtension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
            String safeFileName = UUID.randomUUID().toString() + sanitizedExtension;
            Path targetLocation = UPLOAD_DIR.resolve(safeFileName).normalize();

            if (!targetLocation.startsWith(UPLOAD_DIR)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid file path detected."));
            }

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return relative URL that works seamlessly across localhost and production deployments
            String fileUrl = "/upload/resume/" + safeFileName;
            return ResponseEntity.ok(Map.of("url", fileUrl, "fileName", safeFileName));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to store file: " + e.getMessage()));
        }
    }

    // Authenticated / safe file streaming endpoint
    @GetMapping("/resume/{fileName:.+}")
    public ResponseEntity<Resource> serveResume(@PathVariable String fileName) {
        try {
            Path filePath = UPLOAD_DIR.resolve(fileName).normalize();

            // Guard against directory traversal
            if (!filePath.startsWith(UPLOAD_DIR) || !Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
            if (fileName.toLowerCase().endsWith(".pdf")) {
                mediaType = MediaType.APPLICATION_PDF;
            }

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
