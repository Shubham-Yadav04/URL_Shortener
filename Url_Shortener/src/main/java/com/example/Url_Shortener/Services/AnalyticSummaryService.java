package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.DTO.AnalyticSummaryDTO;

import com.example.Url_Shortener.Repository.AnalyticRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticSummaryService {
    private final StringRedisTemplate stringRedisTemplate;
    private final AnalyticRepository analyticRepository;
    public AnalyticSummaryDTO getSummary(Long mappingId){
        try{
            String key= "summary:"+mappingId;
            HashOperations<String,String,String> hashOperations= stringRedisTemplate.opsForHash();
            Map<String,String> cache= hashOperations.entries(key);
            if(!cache.isEmpty()){
                return AnalyticSummaryDTO.builder()
                        .totalCount(Long.parseLong(cache.getOrDefault("totalCount","0")))
                        .topDevice(cache.get("topDevice"))
                        .topPlatform(cache.get("topPlatform"))
                        .topCountry(cache.get("topCountry"))
                        .build();
            }
            AnalyticSummaryDTO summary= analyticRepository.getAnalyticSummary( mappingId);
            if(summary==null) return null;
            Map<String,String> updateCache= new HashMap<>();
            updateCache.put("topCountry",summary.getTopCountry());
            updateCache.put("topDevice",summary.getTopDevice());
            updateCache.put("topPlatform",summary.getTopPlatform());
            updateCache.put("totalCount",summary.getTotalCount().toString());
            hashOperations.putAll(key,updateCache);
            stringRedisTemplate.expire(
                    key,
                    Duration.ofMinutes(30)
            );
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
