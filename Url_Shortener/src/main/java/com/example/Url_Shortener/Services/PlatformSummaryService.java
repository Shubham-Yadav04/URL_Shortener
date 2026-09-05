package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.Records.PlatformAnalytic;
import com.example.Url_Shortener.Repository.PlatformSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlatformSummaryService {

    private final PlatformSummaryRepository platformSummaryRepository;


    public List<PlatformAnalytic> getPlatformAnalyticByMappingId(String mappingId){
        return platformSummaryRepository.findPlatformAnalyticByMappingId(mappingId);
    }

}
