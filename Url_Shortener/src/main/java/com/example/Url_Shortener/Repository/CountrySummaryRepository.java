package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.Modal.AnalyticCountrySummary;
import com.example.Url_Shortener.Records.CountryAnalytic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CountrySummaryRepository extends JpaRepository<String, AnalyticCountrySummary> {

    @Query("""
            SELECT new com.example.Url_Shortener.Records.CountryAnalytic(
            a.mappingId,
            a.country,
            a.count
            )
            FROM AnalyticCountrySummary acs
            WHERE acs.mappingId=:mappingId
            """)
    public List<CountryAnalytic> findByMappingId(String mappingId);
}
