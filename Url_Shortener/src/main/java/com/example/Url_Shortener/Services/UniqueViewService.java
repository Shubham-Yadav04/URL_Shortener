package com.example.Url_Shortener.Services;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.dao.DataAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class UniqueViewService {

    private static final Logger logger = LoggerFactory.getLogger(UniqueViewService.class);
    private static final String KEY_PREFIX = "analytics:unique:link:";

    private final StringRedisTemplate redisTemplate;

    public UniqueViewService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void record(Long mappingId, String visitorId) {
        try {
            redisTemplate.opsForHyperLogLog().add(key(mappingId), visitorId);
        } catch (DataAccessException exception) {
            logger.warn("Unable to record unique visitor for link {} because Redis is unavailable", mappingId);
        }
    }

    public long count(Long mappingId) {
        Long count = redisTemplate.opsForHyperLogLog().size(key(mappingId));
        return count == null ? 0 : count;
    }

    public void delete(Long mappingId) {
        redisTemplate.delete(key(mappingId));
    }

    private String key(Long mappingId) {
        return KEY_PREFIX + mappingId;
    }
}
