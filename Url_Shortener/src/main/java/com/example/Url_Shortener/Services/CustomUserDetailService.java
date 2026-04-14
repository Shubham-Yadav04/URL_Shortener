package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.DTO.CustomUserDetails;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        // 🔐 Prevent wrong login method
        if (!user.getProviders().contains("LOCAL")) {
            throw new RuntimeException("Use OAuth login instead");
        }

        return new CustomUserDetails(user);
    }
}