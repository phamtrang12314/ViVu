package com.vivugo.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;

@RestController
public class ImageController {

    private final String fallbackAssetBaseUrl;

    public ImageController(
            @Value("${app.asset-fallback-base-url:https://vivugo-client.vercel.app}") String fallbackAssetBaseUrl
    ) {
        this.fallbackAssetBaseUrl = fallbackAssetBaseUrl;
    }

    @GetMapping("/images/**")
    public ResponseEntity<?> getImage(HttpServletRequest request) throws Exception {
        String uri = request.getRequestURI();
        String relativePath = uri.substring(uri.indexOf("/images/") + "/images/".length());
        Path safeRelativePath = Paths.get(relativePath).normalize();
        if (safeRelativePath.isAbsolute() || safeRelativePath.startsWith("..")) {
            return ResponseEntity.badRequest().build();
        }

        Resource uploaded = new UrlResource(Path.of("uploads", "images").resolve(safeRelativePath).normalize().toUri());
        if (uploaded.exists() && uploaded.isReadable()) {
            return imageResponse(uploaded);
        }

        Resource bundled = new ClassPathResource("static/images/" + safeRelativePath.toString().replace('\\', '/'));
        if (bundled.exists() && bundled.isReadable()) {
            return imageResponse(bundled);
        }

        return ResponseEntity
                .status(302)
                .header(HttpHeaders.LOCATION, fallbackUrl(safeRelativePath.toString()))
                .build();
    }

    private ResponseEntity<Resource> imageResponse(Resource resource) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofDays(30)).cachePublic())
                .contentType(MediaTypeFactory.getMediaType(resource).orElse(MediaType.APPLICATION_OCTET_STREAM))
                .body(resource);
    }

    private String fallbackUrl(String relativePath) {
        String lower = relativePath == null ? "" : relativePath.toLowerCase();
        String fileName;
        if (lower.contains("halong") || lower.contains("catba") || lower.contains("phuquoc")
                || lower.contains("nhatrang") || lower.contains("vungtau")) {
            fileName = "blog-03.avif";
        } else if (lower.contains("sapa") || lower.contains("hagiang") || lower.contains("mocchau")
                || lower.contains("maichau") || lower.contains("ninhbinh") || lower.contains("bavi")) {
            fileName = "dulichmaohiem.avif";
        } else if (lower.contains("hue") || lower.contains("hoian") || lower.contains("danang")
                || lower.contains("quang") || lower.contains("binhdinh")) {
            fileName = "blog-02.jpg";
        } else if (lower.contains("hanoi") || lower.contains("yentu")) {
            fileName = "blog-01.avif";
        } else if (lower.contains("tour")) {
            fileName = "hero.jpg";
        } else {
            fileName = "khamphaamthuc.avif";
        }

        String base = fallbackAssetBaseUrl.replaceAll("/+$", "");
        return URI.create(base + "/" + fileName).toString();
    }
}
