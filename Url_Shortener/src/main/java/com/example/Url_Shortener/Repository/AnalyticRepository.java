package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.DTO.AnalyticSummaryDTO;
import com.example.Url_Shortener.DTO.DailyCountDTO;

import com.example.Url_Shortener.Modal.Analytic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AnalyticRepository extends JpaRepository<Analytic,Long>{


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
    List<DailyCountDTO> last7DaysSummary(Long mappingId);


    @Query(
            value = """
SELECT
    (
        SELECT CAST(SUM(count) AS BIGINT)
        FROM analytic_country_summary
        WHERE mapping = :mappingId
    ) AS totalCount,

    (
        SELECT country
        FROM analytic_country_summary
        WHERE mapping = :mappingId
        ORDER BY count DESC
        LIMIT 1
    ) AS topCountry,

    (
        SELECT device
        FROM analytic_device_summary
        WHERE mapping = :mappingId
        ORDER BY count DESC
        LIMIT 1
    ) AS topDevice,

    (
        SELECT platform
        FROM analytic_platform_summary
        WHERE mapping = :mappingId
        ORDER BY count DESC
        LIMIT 1
    ) AS topPlatform;
""", nativeQuery = true)
    AnalyticSummaryDTO getAnalyticSummary(@Param("mappingId") Long mappingId);
}
