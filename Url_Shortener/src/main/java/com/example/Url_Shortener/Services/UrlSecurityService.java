package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.ExceptionHandler.Exceptions.ResourceNotFoundException;
import com.example.Url_Shortener.DTO.RedisMappingDTO;
import com.example.Url_Shortener.Modal.UrlConfig;
import com.example.Url_Shortener.Modal.UrlMapping;
import com.example.Url_Shortener.Repository.MappingRepository;
import com.example.Url_Shortener.Repository.UrlConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class UrlSecurityService {

    private final MappingRepository mappingRepository;
    private final UrlConfigRepository urlConfigRepository;
    private final PasswordEncoder passwordEncoder;
    @Qualifier("redisTemplate")
    private final RedisTemplate<String, RedisMappingDTO> redirectCache;

    @Transactional
    public void protectUrl(Long mappingId, String rawPassword, String userId) {

        UrlMapping mapping = getOwnedMapping(mappingId, userId);

        UrlConfig config = mapping.getUrlConfig();
        if (config == null) {
            config = urlConfigRepository.save(new UrlConfig());
            mapping.setUrlConfig(config);
        }

        requirePassword(rawPassword);
        config.setProtected(true);
        config.setPasswordHash(passwordEncoder.encode(rawPassword));
        invalidateCache(mapping);
    }

    @Transactional
    public void removeProtection(Long mappingId, String userId) {

        UrlMapping mapping = getOwnedMapping(mappingId, userId);

        UrlConfig config = mapping.getUrlConfig();

        if (config != null) {
            config.setProtected(false);
            config.setPasswordHash(null);
        }
        invalidateCache(mapping);
    }

    @Transactional
    public void changePassword(Long mappingId, String newPassword, String userId) {

        UrlMapping mapping = getOwnedMapping(mappingId, userId);

        UrlConfig config = mapping.getUrlConfig();

        if (config == null || !config.isProtected()) {
            throw new IllegalStateException("URL is not protected");
        }

        requirePassword(newPassword);
        config.setPasswordHash(passwordEncoder.encode(newPassword));
        invalidateCache(mapping);
    }

    @Transactional
    public void activateUrl(Long mappingId, String userId) {

        UrlMapping mapping = getOwnedMapping(mappingId, userId);

        ensureConfig(mapping).setDeactivatedAt(null);
        invalidateCache(mapping);
    }

    @Transactional
    public void deactivateUrl(Long mappingId, String userId) {

        UrlMapping mapping = getOwnedMapping(mappingId, userId);

        ensureConfig(mapping).setDeactivatedAt(Instant.now());
        invalidateCache(mapping);
    }

    public boolean verifyPassword(UrlMapping mapping, String rawPassword) {

        UrlConfig config = mapping.getUrlConfig();

        if (config == null || !config.isProtected()) {
            return true; // no password required
        }

        return passwordEncoder.matches(rawPassword, config.getPasswordHash());
    }

    private UrlMapping getOwnedMapping(Long mappingId, String userId) {
        UrlMapping mapping = mappingRepository.findById(mappingId)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found"));
        if (mapping.getOwner() == null || !mapping.getOwner().getUserId().equals(userId)) {
            throw new AccessDeniedException("You are not allowed to manage this link");
        }
        return mapping;
    }

    private UrlConfig ensureConfig(UrlMapping mapping) {
        UrlConfig config = mapping.getUrlConfig();
        if (config == null) {
            config = urlConfigRepository.save(new UrlConfig());
            mapping.setUrlConfig(config);
        }
        return config;
    }

    private void invalidateCache(UrlMapping mapping) {
        redirectCache.delete("url:v2:" + mapping.getShortCode());
    }

    private void requirePassword(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password must not be empty");
        }
    }
}
