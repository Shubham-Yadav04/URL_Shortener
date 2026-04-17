package com.example.Url_Shortener.Services;


import com.example.Url_Shortener.ExceptionHandler.Exceptions.ResourceNotFoundException;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.UserAlreadyExistsException;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {
    private final UserRepository userRepository;
private final BCryptPasswordEncoder bCryptPasswordEncoder;
    public UserService(UserRepository userRepository,BCryptPasswordEncoder bCryptPasswordEncoder
    ) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder=bCryptPasswordEncoder;
    }
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("Email " + user.getEmail() + " is already in use.");
        }
        if(user.getPassword()!=null){
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }
    public User signup( String email,String password) {

        String userEmail = email.toLowerCase();

        User existingUser = userRepository.findByEmail(userEmail).orElse(null);

        if (existingUser != null) {
            if (existingUser.getProviders().contains("LOCAL")) {
                throw new RuntimeException("User already exists with LOCAL login");
            }
            existingUser.getProviders().add("LOCAL");
            existingUser.setPassword(bCryptPasswordEncoder.encode(password));

            return userRepository.save(existingUser);
        }

//      New user
        User user = new User();
        user.setEmail(userEmail);
        user.setUsername(userEmail);
        user.setPassword(bCryptPasswordEncoder.encode(password));

        Set<String> providers = new HashSet<>();
        providers.add("LOCAL");
        user.setProviders(providers);

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
                    // Update only modified fields
                    existingUser.setUsername(updatedUser.getUsername());
                    existingUser.setEmail(updatedUser.getEmail());
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
}
