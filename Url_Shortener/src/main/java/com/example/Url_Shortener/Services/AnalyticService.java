package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.DTO.AnalyticSummaryDTO;
import com.example.Url_Shortener.DTO.DailyCountDTO;
import com.example.Url_Shortener.DTO.KafkaDTO;
import com.example.Url_Shortener.DTO.RedirectAnalyticDTO;
import com.example.Url_Shortener.Repository.AnalyticRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AnalyticService {

    private final StringRedisTemplate stringRedisTemplate;
    private final AnalyticRepository analyticRepository;
    public AnalyticService( StringRedisTemplate stringRedisTemplate,AnalyticRepository analyticRepository) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.analyticRepository=analyticRepository;
    }
    public void updateRedis(KafkaDTO event) {

        HashOperations<String, String, String> hashOps =
                stringRedisTemplate.opsForHash();

        String hashKey = "hash:" + event.getMappingId();

        hashOps.increment(hashKey,
                "country:" + safe(event.getCountry()), 1);

        hashOps.increment(hashKey,
                "device:" + safe(event.getDeviceType()), 1);

        hashOps.increment(hashKey,
                "platform:" + safe(event.getReferrer()), 1);

        hashOps.increment(hashKey,
                "totalCount", 1);

        stringRedisTemplate.expire(hashKey, Duration.ofHours(24));
    }
    public Map<RedirectAnalyticDTO, Long> aggregateBatch(List<KafkaDTO> events) {

        System.out.println("applying batch operation ");
        System.out.println(events.toString());
        Map<RedirectAnalyticDTO, Long> batchAggregation = new HashMap<>();

        for (KafkaDTO event : events) {

            RedirectAnalyticDTO key = new RedirectAnalyticDTO(
                    event.getMappingId(),
                    LocalDateTime.now(),
                    safe(event.getCountry()),
                    safe(event.getDeviceType()),
                    safe(event.getReferrer())
            );

            batchAggregation.merge(key, 1L, Long::sum);
        }

        return batchAggregation;
    }
    private String safe(String value) {
        return value != null && !value.isEmpty() ? value : "none";
    }

    public AnalyticSummaryDTO getAnalyticSummary(Long mappingId){
        try{
            return analyticRepository.getAnalyticSummary(mappingId);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    public List<DailyCountDTO> last7DayAnalysis(Long mappingId){
        try{
            return analyticRepository.last7DaysSummary(mappingId);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
