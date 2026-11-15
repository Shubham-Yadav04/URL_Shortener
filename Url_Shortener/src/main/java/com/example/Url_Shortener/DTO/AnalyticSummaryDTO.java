package com.example.Url_Shortener.DTO;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticSummaryDTO {
    private Long totalCount;
    private String topCountry;
    private String topDevice;
    private String topPlatform;
    private Long uniqueViews;

    public AnalyticSummaryDTO(Long totalCount, String topCountry, String topDevice, String topPlatform) {
        this.totalCount = totalCount;
        this.topCountry = topCountry;
        this.topDevice = topDevice;
        this.topPlatform = topPlatform;
    }
}
