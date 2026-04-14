package com.example.Url_Shortener.DTO;

import com.example.Url_Shortener.Modal.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 🔥 You can later map roles here
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return user.getPassword(); // null for OAuth users
    }

    @Override
    public String getUsername() {
        return user.getUsername(); // or email
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}