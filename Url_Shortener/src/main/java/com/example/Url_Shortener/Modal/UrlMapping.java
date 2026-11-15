package com.example.Url_Shortener.Modal;


import jakarta.persistence.*;
import lombok.*;
import java.net.URL;
import java.time.Instant;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        uniqueConstraints ={
                @UniqueConstraint(columnNames = {"short_code"})
        }


)
public class UrlMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long mappingId;
private String projectName;
    private String shortCode;
    private URL longUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User owner;
    private Instant createdAt= Instant.now();
    private Instant expiresAt;
    @OneToOne
    private UrlConfig urlConfig;
}
