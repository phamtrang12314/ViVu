package com.vivugo.backend.config;

import com.vivugo.backend.repository.AccountRepository;
import com.vivugo.backend.repository.AdminRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class ApplicationConfig {

    private final AccountRepository accountRepository;
    private final AdminRepository adminRepository;

    // (1) CẬP NHẬT CONSTRUCTOR
    // Chúng ta chỉ cần AccountRepository để tạo UserDetailsService.
    // Chúng ta KHÔNG cần PasswordEncoder ở đây nữa.
    public ApplicationConfig(AccountRepository accountRepository, AdminRepository adminRepository) {
        this.accountRepository = accountRepository;
        this.adminRepository = adminRepository;
    }

    // (2) Bean PasswordEncoder vẫn nằm ở đây, đây là nơi nó được tạo
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // (3) Bean UserDetailsService vẫn như cũ
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> accountRepository.findByUserName(username)
                .map(user -> (org.springframework.security.core.userdetails.UserDetails) user)
                .or(() -> adminRepository.findByPhoneNumber(username)
                        .map(admin -> (org.springframework.security.core.userdetails.UserDetails) admin))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    // (4) CẬP NHẬT PHƯƠNG THỨC NÀY
    // Thay vì dùng biến "this.passwordEncoder", chúng ta yêu cầu Spring
    // tiêm (inject) bean PasswordEncoder làm tham số trực tiếp cho phương thức này.
    @Bean
    public AuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder, UserDetailsService userDetailsService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // Dùng UserDetailsService
        authProvider.setPasswordEncoder(passwordEncoder); // Dùng PasswordEncoder vừa được tiêm
        return authProvider;
    }

    // (5) Bean AuthenticationManager vẫn như cũ
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
