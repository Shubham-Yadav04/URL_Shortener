package com.example.Url_Shortener.Services;


import com.example.Url_Shortener.DTO.SignUpDTO;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.ResourceNotFoundException;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.UserAlreadyExistsException;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder bCryptPasswordEncoder
    ) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder=bCryptPasswordEncoder;

    }
    public User createUser(User user) {
        user.setEmail(normalizeEmail(user.getEmail()));
        if (userRepository.existsByEmailIgnoreCase(user.getEmail())) {
            throw new UserAlreadyExistsException("Email " + user.getEmail() + " is already in use.");
        }
        if(user.getPassword()!=null){
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }
    @Transactional
    public User signup(SignUpDTO signUpDTO) {
        if (signUpDTO.getEmail() == null || signUpDTO.getEmail().isBlank()
                || signUpDTO.getPassword() == null || signUpDTO.getPassword().isBlank()
                || signUpDTO.getUsername() == null || signUpDTO.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username, email, and password are required");
        }
        String userEmail = normalizeEmail(signUpDTO.getEmail());
        if (userRepository.existsByEmailIgnoreCase(userEmail)) {
            throw new UserAlreadyExistsException("An account already exists for this email");
        }

        User user = new User();
        user.setEmail(userEmail);
        user.setUsername(signUpDTO.getUsername());
        user.setPassword(bCryptPasswordEncoder.encode(signUpDTO.getPassword()));
        user.setProviders(new HashSet<>(Set.of("LOCAL")));
        return userRepository.save(user);
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUser(String userId, User updatedUser) {
        return userRepository.findById(userId)
                .map(existingUser -> {
                    if (updatedUser.getUsername() != null && !updatedUser.getUsername().isBlank()) {
                        existingUser.setUsername(updatedUser.getUsername().trim());
                    }
                    if (updatedUser.getEmail() != null && !updatedUser.getEmail().isBlank()) {
                        String email = updatedUser.getEmail().trim().toLowerCase(Locale.ROOT);
                        if (userRepository.existsByEmailIgnoreCaseAndUserIdNot(email, userId)) {
                            throw new UserAlreadyExistsException("Email is already in use");
                        }
                        existingUser.setEmail(email);
                    }
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Update failed: User ID " + userId + " not found"));
    }
@Transactional
    public void deleteUser(String userId) {
        // Optimization: Use existsById to avoid loading the full entity into memory just to delete it
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Delete failed: User ID " + userId + " not found");
        }
        userRepository.deleteById(userId);
    }

    public User getUserByEmail(String email){
        return email == null
                ? null
                : userRepository.findCanonicalByEmail(normalizeEmail(email)).orElse(null);
    }

    @Transactional
    public User setPassword(String userId, String password) {
        if (password == null || password.isBlank() || password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        User user = getUserById(userId);
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            throw new UserAlreadyExistsException("A password is already configured for this account");
        }
        user.setPassword(bCryptPasswordEncoder.encode(password));
        if (user.getProviders() == null) user.setProviders(new HashSet<>());
        user.getProviders().add("LOCAL");
        return userRepository.save(user);
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

}
