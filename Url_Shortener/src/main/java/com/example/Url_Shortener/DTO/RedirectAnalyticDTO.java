package com.example.Url_Shortener.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RedirectAnalyticDTO {

    private Long mappingId;
    private String date;
    private String country;
    private String device;
    private String platform;

    // constructor, equals, hashCode

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RedirectAnalyticDTO that)) return false;
        return Objects.equals(mappingId, that.mappingId) &&
                Objects.equals(date, that.date) &&
                Objects.equals(country, that.country) &&
                Objects.equals(device, that.device) &&
                Objects.equals(platform, that.platform);
    }

    @Override
    public int hashCode() {
        return Objects.hash(mappingId, date, country, device, platform);
    }
}
