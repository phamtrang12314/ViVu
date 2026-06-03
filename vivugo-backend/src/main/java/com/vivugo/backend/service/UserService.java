package com.vivugo.backend.service;

import com.vivugo.backend.dto.UserProfileResponse;
import com.vivugo.backend.dto.UserUpdateRequest;
import com.vivugo.backend.exception.ResourceNotFoundException;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.User;
import com.vivugo.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;

@Service
public class UserService {

    private static final String AVATAR_UPLOAD_DIR = "uploads/images/avatars";
    private static final long MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserProfileResponse updateUserProfile(UserUpdateRequest request, Account currentUser) {
        User user = currentUser.getUser();

        if (user == null) {
            throw new ResourceNotFoundException("User entity not found for the authenticated account.");
        }

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarURL(request.getAvatarUrl());
        }

        userRepository.save(user);

        return new UserProfileResponse(currentUser);
    }

    @Transactional
    public UserProfileResponse uploadAvatar(MultipartFile file, Account currentUser) throws IOException {
        if (currentUser == null || currentUser.getUser() == null) {
            throw new ResourceNotFoundException("User not found.");
        }
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File ảnh không hợp lệ.");
        }
        if (file.getSize() > MAX_AVATAR_SIZE_BYTES) {
            throw new IllegalArgumentException("Kích thước ảnh vượt quá 5MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
            throw new IllegalArgumentException("Chỉ hỗ trợ tệp ảnh.");
        }

        String originalName = file.getOriginalFilename();
        String extension = ".jpg";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf('.')).toLowerCase(Locale.ROOT);
        }
        if (!extension.matches("\\.(jpg|jpeg|png|gif|webp)$")) {
            extension = ".jpg";
        }

        Path uploadPath = Paths.get(AVATAR_UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = "avatar-" + UUID.randomUUID() + extension;
        Path target = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        User user = currentUser.getUser();
        user.setAvatarURL("/images/avatars/" + fileName);
        userRepository.save(user);

        return new UserProfileResponse(currentUser);
    }
}
