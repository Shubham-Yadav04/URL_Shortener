package com.example.Url_Shortener.Modal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        indexes = {
                @Index(name="mapping_platform_index" ,columnList = "mapping, platform")
        }
)
public class AnalyticPlatformSummary{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "mapping")
    private UrlMapping mappingId;
    private String platform;
    private Long count;
}