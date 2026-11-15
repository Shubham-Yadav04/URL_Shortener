package com.example.Url_Shortener.DTO;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UrlMappingDTO {
    private String projectName;
    private Boolean isProtected;
    private String longUrl;
    private String shortUrl;
    private String owner;
    private Long mappingId;
    private Instant expiresAt;
    private boolean active;
    private long uniqueViews;
}
