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
public class UrlMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String mappingId;
    private URL shortUrl;
    private URL longUrl;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
    private Date createdAt= new Date();
}
