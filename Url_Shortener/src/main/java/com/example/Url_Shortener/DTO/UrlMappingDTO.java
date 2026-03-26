package com.example.Url_Shortener.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UrlMappingDTO {

    private long uniqueCount;
    private boolean isProtected;
    private byte[] qrCode;
    private String longUrl;
    private String shortUrl;
    private String owner;
    private Long mappingId;
}
