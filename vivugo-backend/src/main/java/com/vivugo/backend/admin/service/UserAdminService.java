package com.vivugo.backend.admin.service;

import com.vivugo.backend.admin.dto.request.UserCreateRequest;
import com.vivugo.backend.admin.dto.request.UserLockRequest;
import com.vivugo.backend.admin.dto.request.UserUpdateRequest;
import com.vivugo.backend.admin.dto.response.user.UserAdminResponse;
import com.vivugo.backend.admin.dto.response.user.UserBookingHistoryResponse;
import com.vivugo.backend.admin.dto.response.user.UserDetailResponse;
import com.vivugo.backend.admin.dto.response.user.UserStatsResponse;
import com.vivugo.backend.exception.ConflictException;
import com.vivugo.backend.exception.ResourceNotFoundException;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.Booking;
import com.vivugo.backend.model.User;
import com.vivugo.backend.model.enums.BookingStatus;
import com.vivugo.backend.model.enums.RoleType;
import com.vivugo.backend.repository.AccountRepository;
import com.vivugo.backend.repository.BookingRepository;
import com.vivugo.backend.repository.UserRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserAdminService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    public UserAdminService(AccountRepository accountRepository,
                            UserRepository userRepository,
                            BookingRepository bookingRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Lấy danh sách user
    public Page<UserAdminResponse> getAllUsers(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);

        Specification<Account> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Chỉ lấy user role CUSTOMER
            predicates.add(cb.equal(root.get("role"), RoleType.CUSTOMER));

            if (search != null && !search.isEmpty()) {
                String keyword = "%" + search.toLowerCase() + "%";

                Join<Account, com.vivugo.backend.model.User> userJoin =
                        root.join("user", JoinType.INNER);

                Predicate nameLike =
                        cb.like(cb.lower(userJoin.get("name")), keyword);
                Predicate emailLike =
                        cb.like(cb.lower(userJoin.get("email")), keyword);

                predicates.add(cb.or(nameLike, emailLike));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Account> pageData = accountRepository.findAll(spec, pageable);

        return pageData.map(UserAdminResponse::new);
    }

    // Chi tiết user
//    public UserAdminResponse getUserDetail(String userId) {
//        Account acc = accountRepository.findByUser_UserID(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        return new UserAdminResponse(acc);
//    }
    public UserDetailResponse getUserDetail(String userId) {

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var account = accountRepository.findByUser_UserID(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        return new UserDetailResponse(
                user.getUserID(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                account.getRole().name(),
                account.isLocked(),
                account.getCreateDate(),
                account.getUpdateDate()
        );
    }

    // Cập nhật user
    @Transactional
    public void updateUser(String userId, UserUpdateRequest req) {
        Account acc = accountRepository.findByUser_UserID(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        acc.setLocked(req.isLocked());
//        acc.setRole(req.getRole());

        com.vivugo.backend.model.User user = acc.getUser();
        user.setName(req.getName());
//        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhoneNumber());

        userRepository.save(user);
        accountRepository.save(acc);
    }

    // Khóa/mở khóa
    @Transactional
    public void lockOrUnlockUser(String userId, UserLockRequest request) {
        Account acc = accountRepository.findByUser_UserID(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (acc.getRole() == RoleType.ADMIN) {
            throw new SecurityException("Không thể khóa tài khoản ADMIN");
        }

        acc.setLocked(request.isLock());
        accountRepository.save(acc);
    }

    // Lịch sử đặt tour
    public List<UserBookingHistoryResponse> getUserBookingHistory(String userId) {
        List<Booking> bookings = bookingRepository.findByUser_UserID(userId);

        return bookings.stream().map(b ->
                new UserBookingHistoryResponse(
                        b.getBookingID(),
                        b.getTour().getTitle(),
                        b.getBookingDate().toLocalDate().toString(),
                        b.getTotalPrice(),
                        b.getStatus().name()
                )
        ).toList();
    }

    // Thống kê
    public UserStatsResponse getUserStats(String userId) {
        long total = bookingRepository.countByUser_UserID(userId);
        long completed = bookingRepository.countByUser_UserIDAndStatus(userId, BookingStatus.COMPLETED);
        long cancelled = bookingRepository.countByUser_UserIDAndStatus(userId, BookingStatus.CANCELED);

        Double amount  = bookingRepository.sumTotalAmountByUser(userId);
        if (amount  == null) amount  = 0.0;

        return new UserStatsResponse(total, completed, cancelled, amount );
    }

    public List<UserBookingHistoryResponse> getUserBookings(String userId) {
        List<Booking> bookings = bookingRepository.findByUser_UserID(userId);

        return bookings.stream().map(b ->
                new UserBookingHistoryResponse(
                        b.getBookingID(),
                        b.getTour().getTitle(),
                        b.getBookingDate().toLocalDate().toString(),
                        b.getTotalPrice(),
                        b.getStatus().name()
                )
        ).toList();
    }
    public Map<String, Long> getUserStats() {
        long total = accountRepository.countByRole(RoleType.CUSTOMER);
        long active = accountRepository.countByRoleAndIsLocked(RoleType.CUSTOMER, false);
        long locked = accountRepository.countByRoleAndIsLocked(RoleType.CUSTOMER, true);

        // NEW USERS THIS MONTH
        LocalDate now = LocalDate.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = now.withDayOfMonth(now.lengthOfMonth()).atTime(23, 59, 59);

        long newUsers = accountRepository.countByRoleAndCreateDateBetween(
                RoleType.CUSTOMER,
                startOfMonth,
                endOfMonth
        );

        Map<String, Long> map = new HashMap<>();
        map.put("totalUsers", total);
        map.put("activeUsers", active);
        map.put("lockedUsers", locked);
        map.put("newUsersThisMonth", newUsers);

        return map;
    }
    @Transactional
    public UserAdminResponse createUser(UserCreateRequest req) {

        // Kiểm tra trùng email
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new ConflictException("Email đã tồn tại");
        }

        // Tạo User
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhoneNumber());
        userRepository.save(user);

        // Tạo Account
        Account acc = new Account();
        acc.setUser(user);
        acc.setUserName(req.getEmail());
        acc.setPassword(passwordEncoder.encode(req.getPassword()));
        acc.setLocked(req.isLocked());
        acc.setRole(RoleType.CUSTOMER);

        accountRepository.save(acc);

        return new UserAdminResponse(acc);
    }

}

//package com.vivugo.backend.admin.service;
//
//import com.vivugo.backend.admin.dto.request.UserLockRequest;
//import com.vivugo.backend.admin.dto.response.user.UserAdminResponse;
//import com.vivugo.backend.exception.ResourceNotFoundException;
//import com.vivugo.backend.model.Account;
//import com.vivugo.backend.model.enums.RoleType;
//import com.vivugo.backend.repository.AccountRepository;
//import com.vivugo.backend.repository.UserRepository;
//import jakarta.persistence.criteria.Join;
//import jakarta.persistence.criteria.JoinType;
//import jakarta.persistence.criteria.Predicate;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.domain.Specification;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class UserAdminService {
//
//    private final AccountRepository accountRepository;
//    private final UserRepository userRepository;
//
//    public UserAdminService(AccountRepository accountRepository, UserRepository userRepository) {
//        this.accountRepository = accountRepository;
//        this.userRepository = userRepository;
//    }
//
//    /**
//     * Lấy danh sách người dùng (Customer) có phân trang và tìm kiếm.
//     */
//    // FIX: Đổi tham số thành int page, int size
//    public Page<UserAdminResponse> getAllUsers(int page, int size, String search) {
//        // Phân trang
//        Pageable pageable = PageRequest.of(page, size);
//
//        // Xây dựng Specification
//        Specification<Account> spec = (root, query, criteriaBuilder) -> {
//            List<Predicate> predicates = new ArrayList<>();
//
//            // 1. Chỉ lấy tài khoản của CUSTOMER
//            predicates.add(criteriaBuilder.equal(root.get("role"), RoleType.CUSTOMER));
//
//            // 2. Tìm kiếm theo Tên hoặc Email (từ bảng User)
//            if (search != null && !search.isEmpty()) {
//                String searchPattern = "%" + search.toLowerCase() + "%";
//                // Phải join từ Account sang User
//                Join<Account, com.vivugo.backend.model.User> userJoin = root.join("user", JoinType.INNER);
//
//                Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(userJoin.get("name")), searchPattern);
//                Predicate emailLike = criteriaBuilder.like(criteriaBuilder.lower(userJoin.get("email")), searchPattern);
//
//                predicates.add(criteriaBuilder.or(nameLike, emailLike));
//            }
//
//            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
//        };
//
//        // Tìm kiếm và ánh xạ sang DTO
//        Page<Account> accountPage = accountRepository.findAll(spec, pageable);
//
//        return accountPage.map(UserAdminResponse::new);
//    }
//
//    /**
//     * Khóa hoặc Mở khóa tài khoản người dùng (tài khoản liên kết với userId)
//     */
//    @Transactional
//    public void lockOrUnlockUser(String userId, UserLockRequest request) {
//        // 1. Tìm Account qua UserID
//        Account account = accountRepository.findByUser_UserID(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
//
//        // 2. Không cho phép khóa/mở khóa tài khoản ADMIN (tự bảo vệ)
//        if (account.getRole() == RoleType.ADMIN) {
//            throw new SecurityException("Cannot lock or unlock an ADMIN account.");
//        }
//
//        // 3. Cập nhật trạng thái khóa
//        account.setLocked(request.isLock());
//        accountRepository.save(account);
//    }
//}