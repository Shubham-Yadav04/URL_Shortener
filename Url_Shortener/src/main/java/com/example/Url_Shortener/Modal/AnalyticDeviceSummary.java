package com.example.Url_Shortener.Modal;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.mapping.Join;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"mapping", "device"}
                ),
        }
)
public class AnalyticDeviceSummary{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    @JoinColumn(name="mapping")
    private UrlMapping mappingId;
    private String device;
    private Long count;
}
