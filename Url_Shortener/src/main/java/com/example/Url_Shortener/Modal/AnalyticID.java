package com.example.Url_Shortener.Modal;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Embeddable
public class AnalyticID implements Serializable {

    @Column(name = "mapping_id")
    private String mappingId;

    @Column(name = "date")
    private LocalDateTime date;

    @Column(name = "country")
    private String country;

    @Column(name = "device")
    private String device;

    @Column(name = "platform")
    private String platform;

    public AnalyticID() {}

    public AnalyticID(String mappingId, LocalDateTime date,
                       String country, String device, String platform) {
        this.mappingId = mappingId;
        this.date = date;
        this.country = country;
        this.device = device;
        this.platform = platform;
    }

    // equals and hashCode (VERY IMPORTANT)

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AnalyticID)) return false;
        AnalyticID that = (AnalyticID) o;
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
