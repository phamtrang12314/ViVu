// src/main/java/com/tripbee/backend/admin/controller/AdminUploadController.java
package com.vivugo.backend.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/uploads")
public class UploadingDestinationController {

    private static final String UPLOAD_ROOT = "uploads/images";

    @PostMapping("/destination-image")
    public ResponseEntity<?> uploadDestinationImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File trống");
        }

        // folder con: destinations
        Path uploadDir = Paths.get(UPLOAD_ROOT, "destinations");
        Files.createDirectories(uploadDir);

        String originalName = StringUtils.cleanPath(file.getOriginalFilename());
        String ext = "";

        int dot = originalName.lastIndexOf('.');
        if (dot != -1) {
            ext = originalName.substring(dot);
        }

        String filename = "des-" + UUID.randomUUID() + ext;
        Path target = uploadDir.resolve(filename);

        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        // URL FE sẽ dùng để hiển thị ảnh
        String url = "/images/destinations/" + filename;

        return ResponseEntity.ok().body(new UploadResponse(url));
    }

    // DTO đơn giản
    public record UploadResponse(String url) {}
}
