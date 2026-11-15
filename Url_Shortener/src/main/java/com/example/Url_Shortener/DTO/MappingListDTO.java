package com.example.Url_Shortener.DTO;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MappingListDTO {
    private long mappingId;
    private String name;
    private  String shortUrl;
    private Instant expiresAt;
    private boolean active;
    private long uniqueViews;
}
