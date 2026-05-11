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
                @Index(name="mapping_country_index" ,columnList = "mapping, country")
        }
)
public class AnalyticCountrySummary{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "mapping")
    private UrlMapping mappingId;
    private String country;
    private Long count=0L;
}
