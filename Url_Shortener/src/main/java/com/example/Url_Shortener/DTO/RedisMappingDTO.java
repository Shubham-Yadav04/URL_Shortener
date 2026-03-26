package com.example.Url_Shortener.DTO;

import jdk.jfr.BooleanFlag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RedisMappingDTO {
    private String longUrl;
    private byte[] qrCode;
    private Boolean isProtected;
    private long uniqueCount;
}
