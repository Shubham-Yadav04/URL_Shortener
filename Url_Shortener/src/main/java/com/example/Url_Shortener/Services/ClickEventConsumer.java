package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.DTO.KafkaDTO;

import com.example.Url_Shortener.Records.CountryKey;
import com.example.Url_Shortener.Records.DeviceKey;
import com.example.Url_Shortener.Records.PlatformKey;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ClickEventConsumer {
    private final AnalyticService analyticService;
    private  final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;
    @KafkaListener(topics = "redirectEvent",
            containerFactory = "redis-update",
            groupId = "redis-update"
    )
    public void updateRedisAnalytic(KafkaDTO kafkaDTO, Acknowledgment ack){
        // consume the click event and update the uniqueCount value in the redis for the mappingId
        try {
            // 1. process event
            analyticService.updateRedis(kafkaDTO); // for the direct update in the redis
            // 2. commit offset ONLY after success
            ack.acknowledge();
        } catch (Exception e) {
            // do NOT acknowledge → Kafka will retry
            throw e;
        }

    }

    @KafkaListener(topics="redirectEvent"
    ,containerFactory = "db-update"
    ,groupId = "db-update"
    )
    @Transactional
    public void updateDBAnalytic(List<ConsumerRecord<String,KafkaDTO>> events, Acknowledgment ack){
        try {
            // 1. process event
            Map<CountryKey, Long> aggregated_country = new HashMap<>();
            Map<DeviceKey, Long> aggregated_device = new HashMap<>();
            Map<PlatformKey, Long> aggregated_platform = new HashMap<>();
            for(ConsumerRecord<String,KafkaDTO> event:events){

                KafkaDTO detail= event.value();
                Long mappingId=detail.getMappingId();
                String country= safeKey(detail.getCountry());
                String device=safeKey(detail.getDeviceType());
                String platform= safeKey(detail.getReferrer());
                CountryKey countryKey=
                        new CountryKey(mappingId, country);
                DeviceKey deviceKey=
                        new DeviceKey(mappingId, device);
                PlatformKey platformKey=
                        new PlatformKey(mappingId, platform);

                aggregated_country.merge(new CountryKey(mappingId, country), 1L, Long::sum);
                aggregated_device.merge(new DeviceKey(mappingId, device), 1L, Long::sum);
                aggregated_platform.merge(new PlatformKey(mappingId, platform), 1L, Long::sum);
            }

            String country_SQL= """
                     INSERT INTO analytics_country_summary
                                    (mapping_id, country, count)
                                    VALUES (?, ?, ?)
                                    ON DUPLICATE KEY UPDATE
                                    count = count + VALUES(count)
                    """;
            String device_SQL= """
                     INSERT INTO analytics_device_summary
                                    (mapping_id, device, count)
                                    VALUES (?, ?, ?)
                                    ON DUPLICATE KEY UPDATE
                                    count = count + VALUES(count)
                    """;
            String platform_SQL= """
                     INSERT INTO analytics_platform_summary
                                    (mapping_id, platform, count)
                                    VALUES (?, ?, ?)
                                    ON DUPLICATE KEY UPDATE
                                    count = count + VALUES(count)
                    """;
transactionTemplate.execute(status-> {


            jdbcTemplate.batchUpdate(
                    country_SQL,
                    aggregated_country.entrySet(),
                    aggregated_country.size(),
                    (ps, entry) -> {

                        CountryKey key = entry.getKey();

                        ps.setLong(1, key.mappingId());
                        ps.setString(2, key.country());
                        ps.setLong(3, entry.getValue());
                    }
            );
            jdbcTemplate.batchUpdate(
                    device_SQL,
                    aggregated_device.entrySet(),
                    aggregated_device.size(),
                    (ps, entry) -> {

                        DeviceKey key = entry.getKey();

                        ps.setLong(1, key.mappingId());
                        ps.setString(2, key.device());
                        ps.setLong(3, entry.getValue());
                    }
            );
            jdbcTemplate.batchUpdate(
                    platform_SQL,
                    aggregated_platform.entrySet(),
                    aggregated_platform.size(),
                    (ps, entry) -> {

                        PlatformKey key = entry.getKey();

                        ps.setLong(1, key.mappingId());
                        ps.setString(2, key.platform());
                        ps.setLong(3, entry.getValue());
                    }
            );
            return null;
        });
            // 2. commit offset ONLY after success
            ack.acknowledge();
        } catch (Exception e) {
            // do NOT acknowledge → Kafka will retry
            throw e;
        }
    }

    private String safeKey(String str){
        if(str==null) return "NIL";
        else return str;
    }

}
