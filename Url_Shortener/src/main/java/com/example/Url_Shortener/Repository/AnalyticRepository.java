package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.DTO.AnalyticSummaryDTO;
import com.example.Url_Shortener.DTO.DailyCountDTO;

import com.example.Url_Shortener.Modal.Analytic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface AnalyticRepository extends JpaRepository<Analytic,Long>{


@Query(
        """
    SELECT
    FUNCTION('DATE', a.date) as day,
    COUNT(a) as count
    
    FROM Analytic a
    WHERE a.mappingId = :mappingId
    AND a.date >= :startDate
    AND a.date < :endDate
    GROUP BY FUNCTION('DATE', a.date)
    ORDER BY FUNCTION('DATE', a.date)
    """
)
    List<DailyCountDTO> last7DaysSummary(@Param("mappingId") Long mappingId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);


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
