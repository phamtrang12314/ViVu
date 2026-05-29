package com.vivugo.backend.admin.controller;

import com.vivugo.backend.admin.dto.request.UserCreateRequest;
import com.vivugo.backend.admin.dto.request.UserLockRequest;
import com.vivugo.backend.admin.dto.request.UserUpdateRequest;
import com.vivugo.backend.admin.dto.response.user.UserAdminResponse;
import com.vivugo.backend.admin.dto.response.user.UserBookingHistoryResponse;
import com.vivugo.backend.admin.dto.response.user.UserStatsResponse;
import com.vivugo.backend.admin.dto.response.user.UserDetailResponse;
import com.vivugo.backend.admin.service.UserAdminService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserAdminController {

    private final UserAdminService userAdminService;

    // GET: Danh sách user
    @GetMapping
    public ResponseEntity<Page<UserAdminResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {

        return ResponseEntity.ok(
                userAdminService.getAllUsers(page, size, search)
        );
    }

    // PUT: Khóa / mở khóa tài khoản
    @PutMapping("/{userId}/lock")
    public ResponseEntity<String> lockOrUnlockUser(
            @PathVariable String userId,
            @RequestBody UserLockRequest request) {

        userAdminService.lockOrUnlockUser(userId, request);

        String action = request.isLock() ? "khóa" : "mở khóa";
        return ResponseEntity.ok("Tài khoản đã được " + action + " thành công!");
    }

    // NEW: GET – Lấy chi tiết user
    @GetMapping("/{userId}")
    public ResponseEntity<UserDetailResponse> getUserDetail(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                userAdminService.getUserDetail(userId)
        );
    }

    // NEW: GET – Thống kê user
    @GetMapping("/{userId}/stats")
    public ResponseEntity<UserStatsResponse> getUserStats(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                userAdminService.getUserStats(userId)
        );
    }

    // NEW: PUT – Cập nhật thông tin user
    @PutMapping("/{userId}")
    public ResponseEntity<String> updateUser(
            @PathVariable String userId,
            @RequestBody UserUpdateRequest request) {

        userAdminService.updateUser(userId, request);
        return ResponseEntity.ok("Cập nhật người dùng thành công!");
    }
    @GetMapping("/{userId}/bookings")
    public ResponseEntity<List<UserBookingHistoryResponse>> getUserBookings(@PathVariable String userId) {
        return ResponseEntity.ok(userAdminService.getUserBookings(userId));
    }
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getUserStats() {
        return ResponseEntity.ok(userAdminService.getUserStats());
    }
    @PostMapping
    public ResponseEntity<UserAdminResponse> createUser(
            @RequestBody UserCreateRequest req) {

        UserAdminResponse res = userAdminService.createUser(req);
        return ResponseEntity.status(201).body(res);
    }
}

//package com.vivugo.backend.admin.controller;
//
//import com.vivugo.backend.admin.dto.request.UserLockRequest;
//import com.vivugo.backend.admin.dto.response.user.UserAdminResponse;
//import com.vivugo.backend.admin.service.UserAdminService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page; // Import Page
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/admin/usersAdmin") // Endpoint theo yêu cầu của bạn
//@RequiredArgsConstructor
//public class UserAdminController {
//
//    private final UserAdminService userAdminService;
//
//    // GET: /api/admin/usersAdmin?page=...&size=...&search=...
//    // FIX: Sửa return type của ResponseEntity để khớp với Service
//    // Sửa tham số để truyền trực tiếp page và size vào Service
//    @GetMapping
//    public ResponseEntity<Page<UserAdminResponse>> getAllUsers(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size,
//            @RequestParam(required = false) String search) {
//
//        // Gọi service với page, size, search
//        Page<UserAdminResponse> userPage = userAdminService.getAllUsers(page, size, search);
//        return ResponseEntity.ok(userPage);
//    }
//
//    // PUT: /api/admin/usersAdmin/{userId}/lock
//    // Khóa hoặc mở khóa tài khoản người dùng
//    // FIX: Sửa return type thành ResponseData (Wrapper) hoặc String (Message)
//    @PutMapping("/{userId}/lock")
//    public ResponseEntity<String> lockOrUnlockUser(
//            @PathVariable String userId,
//            @RequestBody UserLockRequest request) {
//
//        userAdminService.lockOrUnlockUser(userId, request);
//
//        String action = request.isLock() ? "khóa" : "mở khóa";
//        return ResponseEntity.ok("Tài khoản đã được " + action + " thành công!");
//    }
//
//}