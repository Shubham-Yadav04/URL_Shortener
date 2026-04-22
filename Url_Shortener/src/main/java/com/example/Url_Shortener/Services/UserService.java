package com.example.Url_Shortener.Services;


import com.example.Url_Shortener.DTO.LoginDTO;
import com.example.Url_Shortener.DTO.SignUpDTO;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.LoginException;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.ResourceNotFoundException;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.UserAlreadyExistsException;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.UserNotFoundException;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Repository.UserRepository;
import com.example.Url_Shortener.Utils.CustomAuthSuccessHandler;
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
    public User signup(SignUpDTO signUpDTO) {
        String userEmail = signUpDTO.getEmail().toLowerCase();
        String password= signUpDTO.getPassword();
try {
    User existingUser = userRepository.findByEmail(userEmail).orElse(null);

    if (existingUser != null) {
        if (!existingUser.getProviders().isEmpty()) {
            throw new UserAlreadyExistsException("User email already exists try login");
        }
    }
//      New user
    User user = new User();
    user.setEmail(userEmail);
    user.setUsername(signUpDTO.getUsername());
    user.setPassword(bCryptPasswordEncoder.encode(password));
    Set<String> providers = new HashSet<>();
    providers.add("LOCAL");
    user.setProviders(providers);
    return userRepository.save(user);

} catch (RuntimeException e) {
    throw e;
}
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

    public SignUpDTO login(LoginDTO loginDTO) {
        try{
            //apply login
            String email=loginDTO.getEmail();
            String password=loginDTO.getPassword();
            User user = userRepository.findByEmail(email).orElse(null);
            if(user==null){
                throw new UserNotFoundException("no such user found");
            }
            if(bCryptPasswordEncoder.matches(password, user.getPassword())){
                return SignUpDTO.builder().username(user.getUsername())
                        .email(user.getEmail())
                        .password(password)
                        .build();
            }
            throw  new LoginException("wrong Username or Password");

        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
