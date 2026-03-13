package com.example.Url_Shortener.Modal;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.net.URL;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        indexes = {
                @Index(name = "idx_shortcode", columnList = "short_code")
        },
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "long_url"}
        )
)
public class UrlMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long mappingId;
    private String shortCode;
    private URL longUrl;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
    private Date createdAt= new Date();
}
