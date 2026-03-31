package com.example.Url_Shortener.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class KafkaDTO {

    private Long mappingId;
    private String referrer;
    private String deviceType;
    private String country;
    private LocalDateTime date;

}
