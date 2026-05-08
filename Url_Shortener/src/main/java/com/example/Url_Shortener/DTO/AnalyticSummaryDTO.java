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

}
