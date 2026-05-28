// File: src/main/java/com/tripbee/backend/service/ContactMessageService.java

package com.vivugo.backend.service;

import com.vivugo.backend.dto.ContactMessageRequest;
import com.vivugo.backend.model.Account; // Import Account
import com.vivugo.backend.model.ContactMessage;
import com.vivugo.backend.model.User; // Import User
import com.vivugo.backend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ContactMessageService {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    /**
     * Lưu tin nhắn liên hệ mới vào cơ sở dữ liệu
     * @param request Dữ liệu tin nhắn từ Frontend
     * @param currentUser Tài khoản của người dùng đã đăng nhập (hoặc null) <-- THÊM THAM SỐ
     * @return ContactMessage entity đã được lưu
     */
    @Transactional
    public ContactMessage saveNewContactMessage(ContactMessageRequest request, Account currentUser) { // <-- CẬP NHẬT CHỮ KÝ HÀM
        // 1. Map DTO sang Entity
        ContactMessage contactMessage = new ContactMessage();

        contactMessage.setName(request.getName());
        contactMessage.setSubject(request.getSubject());

        contactMessage.setEmail(request.getEmail());
        contactMessage.setPhone(request.getPhone());
        contactMessage.setMessage(request.getMessage());

        // --- BƯỚC KHẮC PHỤC LỖI TẠI ĐÂY ---
        if (currentUser != null && currentUser.getUser() != null) {
            // Lấy đối tượng User từ Account đang đăng nhập
            User user = currentUser.getUser();
            // Gán User vào ContactMessage
            contactMessage.setUser(user); // <-- THÊM DÒNG NÀY
        }
        // ----------------------------------

        // 2. Lưu vào Database
        return contactMessageRepository.save(contactMessage);
    }
}