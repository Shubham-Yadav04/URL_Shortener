package com.example.Url_Shortener.Services;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class ShortCodeBloomFilter {

    private static final String BLOOM_KEY = "short-codes:bloom:v1";
    private static final long BIT_COUNT = 1L << 24;
    private static final int HASH_COUNT = 7;

    private final StringRedisTemplate redisTemplate;

    public ShortCodeBloomFilter(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public boolean mightContain(String value) {
        for (long bit : bitIndexes(value)) {
            Boolean present = redisTemplate.opsForValue().getBit(BLOOM_KEY, bit);
            if (!Boolean.TRUE.equals(present)) {
                return false;
            }
        }
        return true;
    }

    public void add(String value) {
        for (long bit : bitIndexes(value)) {
            redisTemplate.opsForValue().setBit(BLOOM_KEY, bit, true);
        }
    }

    private long[] bitIndexes(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));
            ByteBuffer hashes = ByteBuffer.wrap(digest);
            long firstHash = hashes.getLong();
            long secondHash = hashes.getLong() | 1L;
            long[] indexes = new long[HASH_COUNT];
            for (int i = 0; i < HASH_COUNT; i++) {
                indexes[i] = Math.floorMod(firstHash + i * secondHash, BIT_COUNT);
            }
            return indexes;
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }
}
