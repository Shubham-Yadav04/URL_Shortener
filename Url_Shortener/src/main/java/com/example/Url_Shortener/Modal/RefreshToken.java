package com.example.Url_Shortener.Modal;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@AllArgsConstructor
@Data
@NoArgsConstructor
public class RefreshToken {
    @Id
    private String token;
    private User user;
    private String ip;
    private boolean isRevoked=false;
    private Instant expiryDate;
    private String Device;
}
