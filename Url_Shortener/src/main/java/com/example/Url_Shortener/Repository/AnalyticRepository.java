package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.DTO.AnalyticSummaryDTO;
import com.example.Url_Shortener.DTO.DailyCountDTO;

import com.example.Url_Shortener.Modal.Analytic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AnalyticRepository extends JpaRepository<Analytic,Long>{

    @Query(
            value = """
SELECT
    COUNT(*) AS totalCount,
    (
        SELECT country ,COUNT(*) as countryTraffic
        FROM analytic
        WHERE mapping_id = :mappingId
        GROUP BY country
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS topCountry,

    (
        SELECT device,COUNT(*) AS deviceCount
        FROM analytic
        WHERE mapping_id = :mappingId
        GROUP BY device
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS topDevice,

    (
        SELECT platform ,COUNT(*) as platformCount;
        FROM analytic
        WHERE mapping_id = :mappingId
        GROUP BY platform
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS topPlatform

FROM analytic
WHERE mapping_id = :mappingId
""", nativeQuery = true)
    AnalyticSummaryDTO getAnalyticSummary(String mappingId);

@Query(
        value = """
    SELECT DATE(a.date) AS day,
           COUNT(*) AS total
    FROM your_table a
    WHERE a.mapping_id = :mappingId
      AND a.date >= NOW() - INTERVAL 7 DAY
    GROUP BY DATE(a.date)
    ORDER BY day
""", nativeQuery = true
)
    List<DailyCountDTO> last7DaysSummary(String mappingId);
}
