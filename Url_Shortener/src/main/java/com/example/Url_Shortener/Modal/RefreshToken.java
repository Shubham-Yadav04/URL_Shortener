package com.example.Url_Shortener.Modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;


@Entity
@AllArgsConstructor
@Data
@NoArgsConstructor
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;

    private String token;
    @ManyToOne
    private User user;
    private String ip;
    private boolean isRevoked=false;
    private Instant expiryDate;
    private String Device;
}
