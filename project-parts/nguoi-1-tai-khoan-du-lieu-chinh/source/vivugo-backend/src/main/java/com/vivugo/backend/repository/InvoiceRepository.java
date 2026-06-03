package com.vivugo.backend.repository;

import com.vivugo.backend.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    // Có thể thêm các hàm tìm kiếm tùy chỉnh nếu cần sau này
}