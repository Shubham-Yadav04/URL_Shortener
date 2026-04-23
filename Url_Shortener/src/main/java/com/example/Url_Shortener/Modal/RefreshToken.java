package com.example.Url_Shortener.Modal;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;


@Entity
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;
    private String token;
    @ManyToOne(fetch = FetchType.LAZY )
    private User user;
    private String ip;
    private boolean isRevoked=false;
    private Instant expiryDate;
    private String device;
}
