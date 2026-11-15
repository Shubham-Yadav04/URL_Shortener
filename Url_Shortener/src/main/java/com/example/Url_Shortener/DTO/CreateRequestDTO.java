package com.example.Url_Shortener.DTO;

import lombok.*;

import java.time.Instant;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CreateRequestDTO {

    private Boolean isProtected = false;
    private String password;
    private String shortCode;
    private String longUrl;
    private String projectName;
    private Instant expiresAt;
}
