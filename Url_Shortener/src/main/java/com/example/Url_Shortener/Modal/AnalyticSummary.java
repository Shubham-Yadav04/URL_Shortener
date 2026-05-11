package com.example.Url_Shortener.Modal;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.repository.cdi.Eager;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        indexes = {
                @Index(name="mapping_index" ,columnList = "mapping")
        }
)
public class AnalyticSummary {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "mapping")
    private UrlMapping mappingId;
    private Long totalCount;
    private String topCountry;
    private String topDevice;
    private String topPlatform;
}
