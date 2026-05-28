package com.vivugo.backend.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/uploads")
public class UploadImgTourController {

    // Thư mục thực tế cho hình upload
    private static final String UPLOAD_DIR = "uploads/images/tours";

    @PostMapping("/tour-image")
    public ResponseEntity<?> uploadTourImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File rỗng");
            }

            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalName = file.getOriginalFilename();
            String ext = (originalName != null && originalName.contains("."))
                    ? originalName.substring(originalName.lastIndexOf("."))
                    : "";
            String fileName = UUID.randomUUID() + ext;

            Path target = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            // FE + DB dùng chung format với hình cũ
            String url = "/images/tours/" + fileName;

            return ResponseEntity.ok(new UploadResponse(url));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Upload thất bại");
        }
    }

    public record UploadResponse(String url) {}
}
