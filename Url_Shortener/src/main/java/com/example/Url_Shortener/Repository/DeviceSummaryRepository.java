package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.Modal.AnalyticDeviceSummary;
import com.example.Url_Shortener.Records.DeviceAnalytic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface DeviceSummaryRepository extends JpaRepository<String, AnalyticDeviceSummary> {

    @Query("""
            SELECT new com.example.Url_Shortener.Records.DeviceAnalytic(
            a.mappingId,
            a.device,
            a.count
            )
            FROM AnalyticDeviceSummary
            WHERE a.mappingId=:mappingId
            """)
    public List<DeviceAnalytic> findDeviceAnalyticByMappingId(String mappingId);
}
