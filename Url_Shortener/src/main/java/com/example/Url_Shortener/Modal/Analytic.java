package com.example.Url_Shortener.Modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.sql.Time;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(
        indexes ={
                @Index(name = "idx_mapping_date", columnList = "mapping_id, date"),
                @Index(name = "idx_mapping_country", columnList = "mapping_id, country"),
                @Index(name = "idx_mapping_device", columnList = "mapping_id, device"),
                @Index(name = "idx_mapping_platform", columnList = "mapping_id, platform")
}
)
public class Analytic {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "mapping_id")
    private Long mappingId;

    @Column(name = "date")
    private LocalDateTime date;
    @Column(name = "country")
    private String country;
    @Column(name = "device")
    private String device;
    @Column(name = "platform")
    private String platform;
}
