// File: src/main/java/com/tripbee/backend/admin/service/ContactAdminService.java

package com.vivugo.backend.admin.service;

import com.vivugo.backend.admin.dto.response.ContactMessage.ContactMessageResponse;
import com.vivugo.backend.model.ContactMessage;
import com.vivugo.backend.repository.ContactMessageRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ContactAdminService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactAdminService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public Page<ContactMessageResponse> getAllMessages(int page, int size, String search) {
        // 1. Sắp xếp: Tin nhắn mới nhất lên đầu (DESC theo sentAt)
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "sentAt"));

        // 2. Tạo Specification để lọc dữ liệu (Search)
        Specification<ContactMessage> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isEmpty()) {
                String keyword = "%" + search.toLowerCase() + "%";

                // Tìm kiếm trong Email HOẶC Số điện thoại HOẶC Nội dung tin nhắn
                Predicate emailLike = cb.like(cb.lower(root.get("email")), keyword);
                Predicate phoneLike = cb.like(cb.lower(root.get("phone")), keyword);
                Predicate messageLike = cb.like(cb.lower(root.get("message")), keyword);

                // --- (THÊM MỚI) Tìm kiếm theo ID ---
                Predicate idLike = cb.like(cb.lower(root.get("contactMessID")), keyword);

                Predicate nameLike = cb.like(cb.lower(root.get("name")), keyword);
                Predicate subjectLike = cb.like(cb.lower(root.get("subject")), keyword);

                // Thêm idLike vào trong danh sách OR
                predicates.add(cb.or(
                        emailLike, phoneLike, messageLike, idLike, nameLike, subjectLike
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // 3. Gọi Repository và map sang DTO
        Page<ContactMessage> messagePage = contactMessageRepository.findAll(spec, pageable);
        return messagePage.map(ContactMessageResponse::new);
    }
}