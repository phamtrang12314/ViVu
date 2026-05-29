// File: src/main/java/com/tripbee/backend/admin/dto/response/ContactMessage/ContactMessageResponse.java

package com.vivugo.backend.admin.dto.response.ContactMessage;

import com.vivugo.backend.model.ContactMessage;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ContactMessageResponse {
    private String id;
    private String name; // Tên người gửi (lấy từ form)
    private String email;
    private String phone;
    private String subject; // Chủ đề
    private String message;
    private LocalDateTime sentAt;
    private String userID; // ID người gửi (nếu có)
    private String userName; // Hiển thị tên (từ user Entity, nếu có) // <-- KHÔI PHỤC TRƯỜNG NÀY

    public ContactMessageResponse(ContactMessage msg) {
        this.id = msg.getContactMessID();
        this.name = msg.getName();
        this.email = msg.getEmail();
        this.phone = msg.getPhone();
        this.subject = msg.getSubject();
        this.message = msg.getMessage();
        this.sentAt = msg.getSentAt();

        // Chỉ lấy userID và userName nếu có User liên kết
        if (msg.getUser() != null) {
            this.userID = msg.getUser().getUserID();
            this.userName = msg.getUser().getName(); // <-- LẤY TÊN USER TỪ ENTITY
        } else {
            this.userName = "Guest (Khách vãng lai)"; // <-- LẤY TÊN GUEST TỪ FORM
        }
    }
}