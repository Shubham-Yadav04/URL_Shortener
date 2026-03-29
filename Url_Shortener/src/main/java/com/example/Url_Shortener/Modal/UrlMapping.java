package com.example.Url_Shortener.Modal;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.net.URL;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        indexes = {
                @Index(name = "idx_shortcode", columnList = "short_code")
        },
        uniqueConstraints ={
                @UniqueConstraint(
                        columnNames = {"user_id", "long_url"}
                ),
                @UniqueConstraint(columnNames = {"short_code"})
        }


)
public class UrlMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long mappingId;

    private String shortCode;
    private URL longUrl;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User owner;
    private Instant createdAt= Instant.now();
    @OneToOne
    private UrlConfig urlConfig;

    private long uniqueCount;
}
