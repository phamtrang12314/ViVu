package com.vivugo.backend.service;

import com.vivugo.backend.dto.UserUpdateRequest;
import com.vivugo.backend.dto.UserProfileResponse;
import com.vivugo.backend.exception.ResourceNotFoundException;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.User;
import com.vivugo.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserProfileResponse updateUserProfile(UserUpdateRequest request, Account currentUser) {
        User user = currentUser.getUser();

        if (user == null) {
            throw new ResourceNotFoundException("User entity not found for the authenticated account.");
        }

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarURL(request.getAvatarUrl());
        }

        userRepository.save(user);

        return new UserProfileResponse(currentUser);
    }
}