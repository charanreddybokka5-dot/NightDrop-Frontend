package com.nightdrop.service;

import com.nightdrop.dto.ChangePasswordRequest;
import com.nightdrop.dto.UpdateProfileRequest;
import com.nightdrop.dto.UserDto;
import com.nightdrop.entity.User;
import com.nightdrop.exception.BadRequestException;
import com.nightdrop.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserDto updateProfile(User user, UpdateProfileRequest request) {
        user.setFullName(request.getFullName().trim());
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        User updated = userRepository.save(user);
        return UserDto.builder()
                .id(updated.getId())
                .email(updated.getEmail())
                .fullName(updated.getFullName())
                .phone(updated.getPhone())
                .role(updated.getRole())
                .createdAt(updated.getCreatedAt())
                .build();
    }

    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
