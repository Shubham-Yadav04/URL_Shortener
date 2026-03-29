package com.example.Url_Shortener.Modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.sql.Time;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(
        indexes =
@Index(name = "idx_mapping_date_country",
        columnList = "mapping_id, date, country")
)

public class Analytic {
    @EmbeddedId
    private AnalyticID id;
    private BigInteger count;
}
