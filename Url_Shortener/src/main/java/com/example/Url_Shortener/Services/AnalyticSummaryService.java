package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.DTO.AnalyticSummaryDTO;
import com.example.Url_Shortener.Modal.AnalyticSummary;
import com.example.Url_Shortener.Repository.AnalyticSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticSummaryService {
    private final AnalyticSummaryRepository analyticSummaryRepository;
    public AnalyticSummaryDTO getSummary(Long mappingId){
        try{
            AnalyticSummary summary= analyticSummaryRepository.findByMappingId( mappingId);
            return AnalyticSummaryDTO.builder()
                    .topCountry(summary.getTopCountry())
                    .topPlatform(summary.getTopPlatform())
                    .topDevice(summary.getTopDevice())
                    .totalCount(summary.getTotalCount())
                    .build();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
