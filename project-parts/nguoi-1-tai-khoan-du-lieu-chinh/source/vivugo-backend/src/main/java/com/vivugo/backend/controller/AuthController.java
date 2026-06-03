package com.vivugo.backend.controller;

import com.vivugo.backend.dto.ChangePasswordRequest;
import com.vivugo.backend.dto.LoginRequest;
import com.vivugo.backend.dto.LoginResponse;
import com.vivugo.backend.dto.OtpRequest;
import com.vivugo.backend.dto.RegisterRequest;
import com.vivugo.backend.dto.ResetPasswordRequest;
import com.vivugo.backend.dto.UserProfileResponse;
import com.vivugo.backend.dto.UserUpdateRequest;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.service.AuthService;
import com.vivugo.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @PostMapping("/admin/login")
    public ResponseEntity<LoginResponse> adminLogin(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.adminLogin(loginRequest);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @PostMapping("/register/request-otp")
    public ResponseEntity<LoginResponse> requestRegisterOtp(@RequestBody OtpRequest request) {
        try {
            String message = authService.requestRegistrationOtp(request);
            return ResponseEntity.ok(new LoginResponse(true, message));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest registerRequest) {
        LoginResponse response = authService.register(registerRequest);
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @PostMapping("/forgot-password/request-otp")
    public ResponseEntity<LoginResponse> requestForgotPasswordOtp(@RequestBody OtpRequest request) {
        try {
            String message = authService.requestPasswordResetOtp(request);
            return ResponseEntity.ok(new LoginResponse(true, message));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<LoginResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        LoginResponse response = authService.resetPassword(request);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(@AuthenticationPrincipal Account currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(new UserProfileResponse(currentUser));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @RequestBody UserUpdateRequest request,
            @AuthenticationPrincipal Account currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserProfileResponse updatedProfile = userService.updateUserProfile(request, currentUser);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<?> uploadMyAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal Account currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            UserProfileResponse updatedProfile = userService.uploadAvatar(file, currentUser);
            return ResponseEntity.ok(updatedProfile);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Không thể lưu ảnh đại diện.");
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal Account currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            authService.changePassword(request, currentUser);
            return ResponseEntity.ok("Đổi mật khẩu thành công.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi server.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<LoginResponse> logout() {
        return ResponseEntity.ok(new LoginResponse(true, "Logout successful"));
    }
}
