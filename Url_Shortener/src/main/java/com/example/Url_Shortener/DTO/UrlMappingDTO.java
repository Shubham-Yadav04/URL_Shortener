package com.example.Url_Shortener.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UrlMappingDTO {

    private long uniqueCount;
    private String projectName;
    private boolean isProtected;
    private String longUrl;
    private String shortUrl;
    private String owner;
    private Long mappingId;
}
