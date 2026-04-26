package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.DTO.KafkaDTO;

import com.example.Url_Shortener.DTO.RedirectAnalyticDTO;
import com.example.Url_Shortener.Repository.AnalyticRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ClickEventConsumer {
    private final AnalyticService analyticService;
    private final AnalyticRepository analyticRepository;
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
    , groupId = "db-update"
    )
    public void updateDBAnalytic(List<KafkaDTO> events, Acknowledgment ack){
        try {
            // 1. process event
            Map<RedirectAnalyticDTO, Long> aggregated = analyticService.aggregateBatch(events);

            // Step 2: batch DB upsert
            analyticRepository.batchUpsert(aggregated);
            // 2. commit offset ONLY after success
            ack.acknowledge();
        } catch (Exception e) {
            // do NOT acknowledge → Kafka will retry
            throw e;
        }
    }

}
