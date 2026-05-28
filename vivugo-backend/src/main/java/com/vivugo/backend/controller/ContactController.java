package com.vivugo.backend.controller;

import com.vivugo.backend.dto.ContactMessageRequest;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.ContactMessage;
import com.vivugo.backend.service.ContactMessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact-messages")
public class ContactController {

    private final ContactMessageService contactMessageService;

    // Constructor Injection
    public ContactController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    /**
     * Xử lý yêu cầu gửi tin nhắn liên hệ từ khách hàng (đã đăng nhập hoặc khách vãng lai).
     * API này được cấu hình là permitAll() trong SecurityConfig.
     */
    @PostMapping
    public ResponseEntity<?> createContactMessage(
            @RequestBody ContactMessageRequest request,
            // Spring Security sẽ tự động resolve token JWT thành Account object.
            // Nếu không có token hợp lệ, currentUser sẽ là null.
            @AuthenticationPrincipal Account currentUser
    ) {
        // Kiểm tra dữ liệu bắt buộc cơ bản (có thể thêm logic validation phức tạp hơn)
        if (request.getEmail() == null || request.getEmail().isBlank() ||
                request.getMessage() == null || request.getMessage().isBlank()) {
            return ResponseEntity.badRequest().body("Email và nội dung tin nhắn là bắt buộc.");
        }

        try {
            // Service xử lý việc gán User (nếu có) và lưu tin nhắn.
            ContactMessage newMessage = contactMessageService.saveNewContactMessage(request, currentUser);

            // Trả về thông báo thành công
            return ResponseEntity.status(HttpStatus.CREATED).body("Tin nhắn của bạn đã được gửi thành công!");

        } catch (Exception e) {
            // Log lỗi để debug
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi hệ thống khi gửi tin nhắn: " + e.getMessage());
        }
    }
}