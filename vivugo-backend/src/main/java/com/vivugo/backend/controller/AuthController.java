package com.vivugo.backend.controller;

import com.vivugo.backend.dto.*;
import com.vivugo.backend.model.Account; // (2) THÊM IMPORT
import com.vivugo.backend.service.AuthService;
import com.vivugo.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // (3) THÊM IMPORT
import org.springframework.web.bind.annotation.*;

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
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
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
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
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
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @AuthenticationPrincipal Account currentUser
    ) {


        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Dùng DTO mới của chúng ta để tạo response
        UserProfileResponse response = new UserProfileResponse(currentUser);
        return ResponseEntity.ok(response);
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
            // Lỗi từ AuthService (mật khẩu cũ không chính xác)
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi server.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<LoginResponse> logout() {
        // Trong kiến trúc JWT không trạng thái, việc logout thực tế xảy ra ở client
        // khi nó xóa token. Backend chỉ cần trả về thành công.
        // Token sẽ hết hạn theo thời gian (EXPIRATION_MS).
        return ResponseEntity.ok(new LoginResponse(true, "Logout successful"));
    }
}
