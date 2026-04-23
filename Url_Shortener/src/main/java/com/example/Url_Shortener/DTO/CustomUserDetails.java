package com.example.Url_Shortener.DTO;

import com.example.Url_Shortener.Modal.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
@Setter
public class CustomUserDetails implements UserDetails {

    private final String email;
    private final String password;
    private final String username;
    private final String id;

    public CustomUserDetails(User user) {
        this.email= user.getEmail();
        this.username=user.getUsername();
        this.password= user.getPassword();
        this.id = user.getUserId();
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
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