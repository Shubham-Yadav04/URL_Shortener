package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.Records.DeviceAnalytic;
import com.example.Url_Shortener.Repository.DeviceSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class DeviceSummaryService {

    private final DeviceSummaryRepository deviceSummaryRepository;

    public List<DeviceAnalytic> getDeviceAnalyticByMappingId(String mappingId){
        return deviceSummaryRepository.findDeviceAnalyticByMappingId(mappingId);
    }
}
