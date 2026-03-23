package com.example.Url_Shortener.Modal;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.Mapping;

import java.sql.Time;
import java.time.Instant;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class ClickDetails {
    @Id
    private int id;
    @ManyToOne
    @JoinColumn(name="mapping_id")
    private UrlMapping urlMapping;
    private String ipAddress;
    private Instant timeStamp= Instant.now();
    private String referrer;
    private String device;
}
