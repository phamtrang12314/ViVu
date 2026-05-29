package com.vivugo.backend.service;

import com.vivugo.backend.dto.ChangePasswordRequest;
import com.vivugo.backend.dto.LoginRequest;
import com.vivugo.backend.dto.LoginResponse;
import com.vivugo.backend.dto.OtpRequest;
import com.vivugo.backend.dto.RegisterRequest;
import com.vivugo.backend.dto.ResetPasswordRequest;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.Admin;
import com.vivugo.backend.model.OtpCode;
import com.vivugo.backend.model.User;
import com.vivugo.backend.model.enums.RoleType;
import com.vivugo.backend.repository.AccountRepository;
import com.vivugo.backend.repository.AdminRepository;
import com.vivugo.backend.repository.OtpCodeRepository;
import com.vivugo.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final String PURPOSE_REGISTER = "REGISTER_CUSTOMER";
    private static final String PURPOSE_RESET = "RESET_PASSWORD";
    private static final long OTP_TTL_MINUTES = 5;
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final OtpCodeRepository otpCodeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(AccountRepository accountRepository,
                       UserRepository userRepository,
                       AdminRepository adminRepository,
                       OtpCodeRepository otpCodeRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       EmailService emailService) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.otpCodeRepository = otpCodeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    public LoginResponse login(LoginRequest loginRequest) {
        String identifier = loginRequest.getPhone();
        if (identifier == null || identifier.isBlank()) {
            identifier = loginRequest.getEmail();
        }

        if (identifier == null || identifier.isBlank() || loginRequest.getPassword() == null) {
            return new LoginResponse(false, "Email/số điện thoại hoặc mật khẩu không đúng.");
        }

        String normalizedIdentifier = identifier.trim();
        Optional<Account> accountOpt = accountRepository.findByUserName(normalizedIdentifier);

        if (accountOpt.isEmpty()) {
            accountOpt = userRepository.findByEmail(normalizedIdentifier)
                    .or(() -> userRepository.findByPhoneNumber(normalizedIdentifier))
                    .flatMap(user -> accountRepository.findByUser_UserID(user.getUserID()));
        }

        if (accountOpt.isEmpty()
                || !passwordEncoder.matches(loginRequest.getPassword(), accountOpt.get().getPassword())) {
            return new LoginResponse(false, "Email/số điện thoại hoặc mật khẩu không đúng.");
        }

        Account account = accountOpt.get();

        if (account.isLocked()) {
            return new LoginResponse(false, "Tài khoản đã bị khóa.");
        }

        String jwtToken = jwtService.generateToken(Map.of("token_type", "CUSTOMER"), account);
        return new LoginResponse(
                true,
                "Đăng nhập thành công.",
                "Bearer " + jwtToken,
                account.getUser().getUserID(),
                account.getUser().getEmail(),
                account.getRole().name()
        );
    }

    public LoginResponse adminLogin(LoginRequest loginRequest) {
        Admin admin = adminRepository.findByPhoneNumber(loginRequest.getPhone())
                .orElse(null);
        if (admin == null || !passwordEncoder.matches(loginRequest.getPassword(), admin.getPassword())) {
            return new LoginResponse(false, "Số điện thoại hoặc mật khẩu quản trị viên không đúng.");
        }
        if (admin.isLocked()) {
            return new LoginResponse(false, "Tài khoản quản trị viên đã bị khóa.");
        }

        String jwtToken = jwtService.generateToken(Map.of("token_type", "ADMIN"), admin);
        return new LoginResponse(
                true,
                "Đăng nhập quản trị viên thành công.",
                "Bearer " + jwtToken,
                admin.getAdminID(),
                admin.getEmail(),
                admin.getRole().name()
        );
    }

    @Transactional
    public String requestRegistrationOtp(OtpRequest request) {
        String email = normalizeEmail(request != null ? request.getEmail() : null);
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email đã được đăng ký.");
        }
        return createAndSendOtp(email, PURPOSE_REGISTER);
    }

    @Transactional
    public String requestPasswordResetOtp(OtpRequest request) {
        String email = normalizeEmail(request != null ? request.getEmail() : null);
        if (userRepository.findByEmail(email).isEmpty()) {
            throw new IllegalArgumentException("Email chưa được đăng ký.");
        }
        return createAndSendOtp(email, PURPOSE_RESET);
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (request == null) {
            return new LoginResponse(false, "Thông tin đăng ký không hợp lệ.");
        }
        String email;
        try {
            email = normalizeEmail(request.getEmail());
        } catch (IllegalArgumentException e) {
            return new LoginResponse(false, e.getMessage());
        }
        String phone = normalizePhone(request.getPhone());

        if (request.getName() == null || request.getName().trim().length() < 2) {
            return new LoginResponse(false, "Họ và tên phải có ít nhất 2 ký tự.");
        }
        if (request.getPhone() == null || request.getPhone().isBlank()) {
            return new LoginResponse(false, "Số điện thoại là bắt buộc.");
        }
        if (phone.length() < 10 || phone.length() > 11) {
            return new LoginResponse(false, "Số điện thoại không hợp lệ.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            return new LoginResponse(false, "Mật khẩu phải có ít nhất 8 ký tự.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            return new LoginResponse(false, "Email đã được đăng ký.");
        }
        if (userRepository.findByPhoneNumber(phone).isPresent()
                || accountRepository.findByUserName(phone).isPresent()) {
            return new LoginResponse(false, "Số điện thoại đã được đăng ký.");
        }
        if (!verifyOtp(email, PURPOSE_REGISTER, request.getOtpCode())) {
            return new LoginResponse(false, "Mã OTP không đúng hoặc đã hết hạn.");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPhoneNumber(phone);
        User savedUser = userRepository.save(user);

        Account account = new Account();
        account.setUserName(phone);
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setRole(RoleType.CUSTOMER);
        account.setLocked(false);
        account.setUser(savedUser);
        accountRepository.save(account);

        emailService.sendRegistrationSuccessEmail(savedUser.getEmail(), savedUser.getName());

        String jwtToken = jwtService.generateToken(Map.of("token_type", "CUSTOMER"), account);
        return new LoginResponse(
                true,
                "Đăng ký thành công.",
                "Bearer " + jwtToken,
                savedUser.getUserID(),
                savedUser.getEmail(),
                account.getRole().name()
        );
    }

    @Transactional
    public LoginResponse resetPassword(ResetPasswordRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (request.getNewPassword() == null || request.getNewPassword().length() < 8) {
            return new LoginResponse(false, "Mật khẩu mới phải có ít nhất 8 ký tự.");
        }
        if (!verifyOtp(email, PURPOSE_RESET, request.getOtpCode())) {
            return new LoginResponse(false, "Mã OTP không đúng hoặc đã hết hạn.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy khách hàng."));
        Account account = accountRepository.findByUser_UserID(user.getUserID())
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản."));
        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);
        return new LoginResponse(true, "Đặt lại mật khẩu thành công.");
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request, Account currentUser) {
        if (!passwordEncoder.matches(request.getOldPassword(), currentUser.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không chính xác.");
        }
        if (request.getNewPassword() == null || request.getNewPassword().length() < 8) {
            throw new IllegalArgumentException("Mật khẩu mới phải có ít nhất 8 ký tự.");
        }
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(currentUser);
    }

    private String createAndSendOtp(String email, String purpose) {
        boolean mailConfigured = emailService.hasMailCredentials();
        String code = mailConfigured ? String.format("%06d", secureRandom.nextInt(1_000_000)) : "123456";

        otpCodeRepository.findByEmailAndPurposeAndUsedFalse(email, purpose)
                .forEach(existingOtp -> {
                    existingOtp.setUsed(true);
                    otpCodeRepository.save(existingOtp);
                });

        OtpCode otpCode = new OtpCode();
        otpCode.setEmail(email);
        otpCode.setPurpose(purpose);
        otpCode.setCode(code);
        otpCode.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_TTL_MINUTES));
        otpCodeRepository.save(otpCode);

        if (mailConfigured) {
            emailService.sendOtpEmail(email, code, purpose, OTP_TTL_MINUTES);
            return "Mã OTP đã được gửi đến email của bạn.";
        }

        System.out.println("Mail credentials are missing. Using development OTP " + code + " for " + email);
        return "Chưa cấu hình mail SMTP. Dùng mã OTP tạm thời: " + code;
    }

    private boolean verifyOtp(String email, String purpose, String code) {
        if (email == null || code == null) {
            return false;
        }
        String normalizedEmail;
        try {
            normalizedEmail = normalizeEmail(email);
        } catch (IllegalArgumentException ex) {
            return false;
        }
        String normalizedCode = code.replaceAll("\\D", "");
        if (normalizedCode.length() != 6) {
            return false;
        }

        return otpCodeRepository.findTopByEmailAndPurposeAndCodeAndUsedFalseOrderByCreatedAtDesc(normalizedEmail, purpose, normalizedCode)
                .filter(otp -> otp.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(otp -> {
                    otp.setUsed(true);
                    otpCodeRepository.save(otp);
                    return true;
                })
                .orElse(false);
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            throw new IllegalArgumentException("Email là bắt buộc.");
        }
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        if (!EMAIL_PATTERN.matcher(normalized).matches()) {
            throw new IllegalArgumentException("Email không hợp lệ.");
        }
        return normalized;
    }

    private String normalizePhone(String phone) {
        if (phone == null) {
            return "";
        }
        String digits = phone.replaceAll("\\D", "");
        if (digits.startsWith("84") && digits.length() >= 10) {
            digits = digits.substring(2);
        }
        if (!digits.startsWith("0") && digits.length() == 9) {
            digits = "0" + digits;
        }
        return digits;
    }
}
