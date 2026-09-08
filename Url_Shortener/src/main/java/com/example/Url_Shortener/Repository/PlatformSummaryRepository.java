package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.Modal.AnalyticPlatformSummary;
import com.example.Url_Shortener.Records.PlatformAnalytic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlatformSummaryRepository extends JpaRepository< AnalyticPlatformSummary,Long> {


    @Query("""
            SELECT new com.example.Url_Shortener.Records.PlatformAnalytic(
            a.mappingId.mappingId,
            a.platform,
            a.count
            )
            FROM AnalyticPlatformSummary a
            WHERE a.mappingId.mappingId=:mappingId
            """)
    public List<PlatformAnalytic> findPlatformAnalyticByMappingId(String mappingId);
}
