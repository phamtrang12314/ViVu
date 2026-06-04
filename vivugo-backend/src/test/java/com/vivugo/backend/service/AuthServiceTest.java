package com.vivugo.backend.service;

import com.vivugo.backend.dto.ChangePasswordRequest;
import com.vivugo.backend.dto.LoginRequest;
import com.vivugo.backend.dto.LoginResponse;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.User;
import com.vivugo.backend.model.enums.RoleType;
import com.vivugo.backend.repository.AccountRepository;
import com.vivugo.backend.repository.AdminRepository;
import com.vivugo.backend.repository.OtpCodeRepository;
import com.vivugo.backend.repository.UserRepository;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private final AccountRepository accountRepository = mock(AccountRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final AdminRepository adminRepository = mock(AdminRepository.class);
    private final OtpCodeRepository otpCodeRepository = mock(OtpCodeRepository.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final JwtService jwtService = mock(JwtService.class);
    private final EmailService emailService = mock(EmailService.class);
    private final AuthService service = new AuthService(
            accountRepository,
            userRepository,
            adminRepository,
            otpCodeRepository,
            passwordEncoder,
            jwtService,
            emailService
    );

    @Test
    void loginAcceptsEmailWhenUsernameLookupMisses() {
        User user = user("user-1", "Customer", "customer@example.com", "0912345678");
        Account account = account("0912345678", "encoded-password", RoleType.CUSTOMER, user, false);
        LoginRequest request = new LoginRequest();
        request.setEmail("customer@example.com");
        request.setPassword("secret123");

        when(accountRepository.findByUserName("customer@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));
        when(accountRepository.findByUser_UserID("user-1")).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("secret123", "encoded-password")).thenReturn(true);
        when(jwtService.generateToken(any(Map.class), eq(account))).thenReturn("jwt-token");

        LoginResponse response = service.login(request);

        assertTrue(response.isSuccess());
        assertEquals("Bearer jwt-token", response.getToken());
        assertEquals("user-1", response.getUserID());
        assertEquals("customer@example.com", response.getEmail());
        assertEquals("CUSTOMER", response.getRole());
    }

    @Test
    void loginRejectsLockedAccount() {
        User user = user("user-1", "Customer", "customer@example.com", "0912345678");
        Account account = account("0912345678", "encoded-password", RoleType.CUSTOMER, user, true);
        LoginRequest request = new LoginRequest();
        request.setPhone("0912345678");
        request.setPassword("secret123");

        when(accountRepository.findByUserName("0912345678")).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("secret123", "encoded-password")).thenReturn(true);

        LoginResponse response = service.login(request);

        assertFalse(response.isSuccess());
    }

    @Test
    void changePasswordEncodesAndSavesNewPassword() {
        Account account = account("0912345678", "old-encoded", RoleType.CUSTOMER, user("user-1", "Customer", "customer@example.com", "0912345678"), false);
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("old-secret");
        request.setNewPassword("new-secret");

        when(passwordEncoder.matches("old-secret", "old-encoded")).thenReturn(true);
        when(passwordEncoder.encode("new-secret")).thenReturn("new-encoded");

        service.changePassword(request, account);

        ArgumentCaptor<Account> accountCaptor = ArgumentCaptor.forClass(Account.class);
        verify(accountRepository).save(accountCaptor.capture());
        assertEquals("new-encoded", accountCaptor.getValue().getPassword());
    }

    @Test
    void changePasswordRejectsWrongOldPassword() {
        Account account = account("0912345678", "old-encoded", RoleType.CUSTOMER, user("user-1", "Customer", "customer@example.com", "0912345678"), false);
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("wrong");
        request.setNewPassword("new-secret");

        when(passwordEncoder.matches("wrong", "old-encoded")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> service.changePassword(request, account));
    }

    private User user(String id, String name, String email, String phone) {
        User user = new User();
        user.setUserID(id);
        user.setName(name);
        user.setEmail(email);
        user.setPhoneNumber(phone);
        return user;
    }

    private Account account(String username, String password, RoleType role, User user, boolean locked) {
        Account account = new Account();
        account.setUserName(username);
        account.setPassword(password);
        account.setRole(role);
        account.setUser(user);
        account.setLocked(locked);
        return account;
    }
}
