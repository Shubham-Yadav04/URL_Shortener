package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.Modal.AnalyticSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalyticSummaryRepository extends JpaRepository<AnalyticSummary,Long> {
    AnalyticSummary findByMappingIdMappingId(Long mappingId);
}
