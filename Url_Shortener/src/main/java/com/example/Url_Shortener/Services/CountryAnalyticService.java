package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.Modal.AnalyticCountrySummary;
import com.example.Url_Shortener.Records.CountryAnalytic;
import com.example.Url_Shortener.Repository.CountrySummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CountryAnalyticService {

    private final CountrySummaryRepository countrySummaryRepository;

    public List<CountryAnalytic> getCountryBasedAnalysis(String mappingId){
        return countrySummaryRepository.findByMappingId(mappingId);
    }

}
