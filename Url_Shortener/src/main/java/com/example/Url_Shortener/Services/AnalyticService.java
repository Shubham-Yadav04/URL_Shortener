package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.DTO.KafkaDTO;
import com.example.Url_Shortener.DTO.RedirectAnalyticDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.HashOperations;
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
HashOperations<String,String,Long> hashOperations=redisTemplate.opsForHash();
        // Keys
        String hashKey="hash:"+mappingId;
        Duration ttl = Duration.ofHours(24);
        String countryKey="countryKey:" + safe(event.getCountry());
        String deviceKey="deviceKey:" + safe(event.getDeviceType());
        String platformKey="platformKey:" + safe(event.getReferrer());
        boolean isAnalyticPresent=redisTemplate.hasKey(hashKey);
        if(isAnalyticPresent) {
            Long countryCount = hashOperations.get(hashKey, "countryKey:" + safe(event.getCountry()));
            Long deviceCount= hashOperations.get(hashKey, "deviceKey:" + safe(event.getDeviceType()));
            Long platformCount = hashOperations.get(hashKey, "platformKey:" + safe(event.getReferrer()));
            redisTemplate.opsForHash().increment(hashKey,"totalCount",1);
            if (countryCount!=null) {
                redisTemplate.opsForHash().increment(hashKey, countryKey, 1);
            }
            if (deviceCount!=null) {
                redisTemplate.opsForHash().increment(hashKey, deviceKey, 1);
            }
            if (platformCount!=null) {
                redisTemplate.opsForHash().increment(hashKey, platformKey, 1);
            }
        }
        else {
            // we have to create an analytic hash
            Map<String,Long> map= new HashMap<>();
            map.put(countryKey,1L);
            map.put(deviceKey,1L);
            map.put(platformKey,1L);
            hashOperations.putAll(hashKey,map);
        }
        redisTemplate.expire(hashKey,ttl);
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
