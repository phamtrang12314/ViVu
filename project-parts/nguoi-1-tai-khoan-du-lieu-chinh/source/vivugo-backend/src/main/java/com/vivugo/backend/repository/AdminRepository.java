package com.vivugo.backend.repository;

import com.vivugo.backend.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
    Optional<Admin> findByPhoneNumber(String phoneNumber);
    Optional<Admin> findByEmail(String email);
}
