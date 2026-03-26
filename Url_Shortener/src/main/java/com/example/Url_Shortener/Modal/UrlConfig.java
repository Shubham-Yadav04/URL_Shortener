package com.example.Url_Shortener.Modal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UrlConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String detailId;
    private byte[] qrCode;
    private boolean isProtected=false;
    private String passwordHash;
private boolean isActive=false;
}
