package com.vivugo.backend.repository;

import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.enums.RoleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {

    // Spring Data JPA sẽ tự động hiểu phương thức này
    // và tạo truy vấn: SELECT * FROM "accounts" WHERE "user_name" = ?
    Optional<Account> findByUserName(String userName);
    // Thêm: Tìm Account bằng UserID liên kết
    // SELECT * FROM accounts a JOIN users u ON a.user_id = u.user_id WHERE u.user_id = ?
    Optional<Account> findByUser_UserID(String userID);

    Page<Account> findAll(Specification<Account> spec, Pageable pageable);
    long countByRole(RoleType role);

    long countByRoleAndIsLocked(RoleType role, boolean isLocked);

    long countByRoleAndCreateDateBetween(
            RoleType role,
            LocalDateTime start,
            LocalDateTime end
    );
}