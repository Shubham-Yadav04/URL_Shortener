package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.DTO.AnalyticSummaryDTO;
import com.example.Url_Shortener.DTO.DailyCountDTO;
import com.example.Url_Shortener.DTO.RedirectAnalyticDTO;
import com.example.Url_Shortener.Modal.Analytic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface AnalyticRepository extends JpaRepository <Long, Analytic>{

    @Query(
            value = """
SELECT
    COUNT(*) AS totalCount,
    (
        SELECT country
        FROM analytic
        WHERE mapping_id = :mappingId
        GROUP BY country
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS topCountry,

    (
        SELECT device
        FROM analytic
        WHERE mapping_id = :mappingId
        GROUP BY device
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS topDevice,

    (
        SELECT platform
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
