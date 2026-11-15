package com.example.Url_Shortener.Modal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.Instant;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UrlConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String detailId;
    private boolean isProtected=false;
    private String passwordHash;
    private Instant deactivatedAt;

    public boolean isActive() {
        return deactivatedAt == null;
    }
}
