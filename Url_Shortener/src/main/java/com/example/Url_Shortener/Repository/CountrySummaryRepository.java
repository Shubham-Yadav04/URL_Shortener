package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.Modal.AnalyticCountrySummary;
import com.example.Url_Shortener.Records.CountryAnalytic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CountrySummaryRepository extends JpaRepository<AnalyticCountrySummary, Long> {

    @Query("""
            SELECT new com.example.Url_Shortener.Records.CountryAnalytic(
            a.mappingId.mappingId,
            a.country,
            a.count
            )
            FROM AnalyticCountrySummary a
            WHERE a.mappingId.mappingId=:mappingId
            """)
    public List<CountryAnalytic> findByMappingId(String mappingId);
}
