package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.DTO.KafkaDTO;
import com.example.Url_Shortener.DTO.RedirectAnalyticDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
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

    private final RedisTemplate<String, Object> redisTemplate;

    public AnalyticService(@Qualifier("analytic") RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
    public void updateRedis(KafkaDTO event) {

        Long mappingId = event.getMappingId();

        // Keys
        String totalKey = "analytics:total:" + mappingId;
        String countryKey = "analytics:country:" + mappingId;
        String deviceKey = "analytics:device:" + mappingId;
        String platformKey = "analytics:referrer:" + mappingId;
System.out.println(event.getDate());
System.out.println(event.getReferrer());
        // Increment total count
        redisTemplate.opsForValue().increment(totalKey);
        // Increment grouped counts (using HASH)
        redisTemplate.opsForHash().increment(countryKey, safe(event.getCountry()),1);
        redisTemplate.opsForHash().increment(deviceKey, safe(event.getDeviceType()), 1);
        redisTemplate.opsForHash().increment(platformKey, safe(event.getReferrer()), 1);

        // Optional: set expiry (avoid memory leak)
        Duration ttl = Duration.ofHours(24);
        redisTemplate.expire(totalKey, ttl);
        redisTemplate.expire(countryKey, ttl);
        redisTemplate.expire(deviceKey, ttl);
        redisTemplate.expire(platformKey, ttl);
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
}
