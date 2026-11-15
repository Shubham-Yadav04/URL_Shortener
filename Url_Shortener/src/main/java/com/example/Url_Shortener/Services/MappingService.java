package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.DTO.CreateRequestDTO;
import com.example.Url_Shortener.DTO.MappingListDTO;
import com.example.Url_Shortener.DTO.RedisMappingDTO;
import com.example.Url_Shortener.DTO.UrlMappingDTO;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.InValidShortCode;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.ResourceNotFoundException;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.UrlCreationException;
import com.example.Url_Shortener.Modal.UrlConfig;
import com.example.Url_Shortener.Modal.UrlMapping;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Repository.MappingRepository;
import com.example.Url_Shortener.Repository.UrlConfigRepository;
import com.example.Url_Shortener.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;

import java.net.MalformedURLException;
import java.net.URL;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service

public class MappingService {
    private static final String REDIRECT_CACHE_PREFIX = "url:v2:";
    private static final String SHORT_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final Pattern CUSTOM_CODE_PATTERN = Pattern.compile("[A-Za-z0-9_-]{3,32}");
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final MappingRepository mappingRepository;
    private final UserRepository userRepository;
    private final UrlConfigRepository urlConfigRepository;
    private final RedisTemplate<String, RedisMappingDTO> redirectCache;
    private final RedisTemplate<String, Object> analyticRedisTemplate;
    private final ShortCodeBloomFilter shortCodeBloomFilter;
    private final UniqueViewService uniqueViewService;

    private final PasswordEncoder passwordEncoder;

    @Value("${Base_Short_URL}")
    private String shortBaseUrl;
    public MappingService(MappingRepository mappingRepository,
                          UserRepository userRepository,
                          @Qualifier("redisTemplate") RedisTemplate<String, RedisMappingDTO> redirectCache,
                          @Qualifier("analytic") RedisTemplate<String, Object> analyticRedisTemplate,
                          UrlConfigRepository urlConfigRepository,
                          PasswordEncoder passwordEncoder,
                          ShortCodeBloomFilter shortCodeBloomFilter,
                          UniqueViewService uniqueViewService) {
        this.mappingRepository = mappingRepository;
        this.userRepository = userRepository;
        this.redirectCache = redirectCache;
        this.analyticRedisTemplate = analyticRedisTemplate;
        this.urlConfigRepository = urlConfigRepository;
        this.passwordEncoder = passwordEncoder;
        this.shortCodeBloomFilter = shortCodeBloomFilter;
        this.uniqueViewService = uniqueViewService;
    }

    @Transactional
    public UrlMappingDTO createShortUrl(String userId, CreateRequestDTO request) throws MalformedURLException {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String longUrl = request.getLongUrl();
        URL destination = parseHttpUrl(longUrl);
        if (mappingRepository.existsByOwnerUserIdAndLongUrl(userId, destination)) {
            throw new InValidShortCode("A short link already exists for this destination");
        }
        Instant expiresAt = request.getExpiresAt();
        if (expiresAt != null && !expiresAt.isAfter(Instant.now())) {
            throw new IllegalArgumentException("Expiry must be in the future");
        }

        String requestedCode = request.getShortCode();
        String shortCode = requestedCode == null || requestedCode.isBlank()
                ? generateAvailableRandomCode()
                : normalizeCustomCode(requestedCode);
        if (!isShortCodeAvailable(shortCode)) {
            throw new InValidShortCode("Short code is already in use");
        }

        boolean isProtected = Boolean.TRUE.equals(request.getIsProtected());
        if (isProtected && (request.getPassword() == null || request.getPassword().isBlank())) {
            throw new IllegalArgumentException("A password is required for a protected link");
        }

        UrlConfig urlConfig = new UrlConfig();
        urlConfig.setProtected(isProtected);
        if (isProtected) {
            urlConfig.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        urlConfig = urlConfigRepository.save(urlConfig);

        UrlMapping mapping = UrlMapping.builder()
                .longUrl(destination)
                .shortCode(shortCode)
                .owner(owner)
                .projectName(request.getProjectName())
                .expiresAt(expiresAt)
                .urlConfig(urlConfig)
                .build();
        try {
            mapping = mappingRepository.saveAndFlush(mapping);
        } catch (DataIntegrityViolationException exception) {
            throw new InValidShortCode("Short code is already in use");
        }
        shortCodeBloomFilter.add(shortCode);
        return convertMappingToDTO(mapping);
    }

    @Transactional(readOnly = true)
    public boolean isShortCodeAvailable(String code) {
        if (code == null || !CUSTOM_CODE_PATTERN.matcher(code).matches()) {
            return false;
        }
        boolean possiblyPresent = shortCodeBloomFilter.mightContain(code);
        boolean exists = mappingRepository.existsByShortCode(code);
        if (exists && !possiblyPresent) {
            shortCodeBloomFilter.add(code);
        }
        return !exists;
    }

    @Transactional(readOnly = true)
    public UrlMapping getOwnedMapping(Long mappingId, String userId) {
        UrlMapping mapping = mappingRepository.findById(mappingId)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found"));
        requireOwner(mapping, userId);
        return mapping;
    }

    @Transactional(readOnly = true)
    public UrlMappingDTO getMappingById(Long mappingId, String userId) {
        return convertMappingToDTO(getOwnedMapping(mappingId, userId));
    }

    @Transactional(readOnly = true)
    public UrlMapping getByShortCode(String shortCode) {
        return mappingRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found"));
    }

    @Transactional
    public RedisMappingDTO getRedirectDetails(String shortCode) {
        String cacheKey = cacheKey(shortCode);
        RedisMappingDTO cached = redirectCache.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }

        UrlMapping mapping = getByShortCode(shortCode);
        RedisMappingDTO details = toRedirectDetails(mapping);
        long cacheSeconds = 20 * 60;
        if (mapping.getExpiresAt() != null) {
            cacheSeconds = Math.min(cacheSeconds,
                    Math.max(1, mapping.getExpiresAt().getEpochSecond() - Instant.now().getEpochSecond()));
        }
        redirectCache.opsForValue().set(cacheKey, details, cacheSeconds, java.util.concurrent.TimeUnit.SECONDS);
        return details;
    }

    @Transactional(readOnly = true)
    public List<MappingListDTO> getUserMappings(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        return mappingRepository.findByOwnerUserId(userId).stream()
                .map(mapping -> MappingListDTO.builder()
                        .mappingId(mapping.getMappingId())
                        .name(mapping.getProjectName())
                        .shortUrl(shortBaseUrl + mapping.getShortCode())
                        .expiresAt(mapping.getExpiresAt())
                        .active(isActive(mapping) && !isExpired(mapping))
                        .uniqueViews(uniqueViewService.count(mapping.getMappingId()))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteMapping(Long mappingId) {
        UrlMapping mapping = mappingRepository.findById(mappingId)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found"));
        redirectCache.delete(cacheKey(mapping.getShortCode()));
        uniqueViewService.delete(mapping.getMappingId());
        mappingRepository.delete(mapping);
    }

    @Transactional
    public String updateLongUrl(String shortCode, String longUrl, String userId) throws MalformedURLException {
        UrlMapping mapping = getByShortCode(shortCode);
        requireOwner(mapping, userId);
        mapping.setLongUrl(parseHttpUrl(longUrl));
        redirectCache.delete(cacheKey(shortCode));
        mappingRepository.save(mapping);
        return mapping.getLongUrl().toString();
    }

//    public byte[] generateQR(String shortCode) {
//        try{
//            String shortUrl= shortBaseUrl+shortCode;
//            return utilService.generateQRCode(shortUrl);
//        } catch (RuntimeException e) {
//            throw new RuntimeException(e);
//        }
//    }
    public UrlMappingDTO convertMappingToDTO(UrlMapping urlMapping){
        return UrlMappingDTO.builder()
                .isProtected(urlMapping.getUrlConfig() != null && urlMapping.getUrlConfig().isProtected())
                .mappingId(urlMapping.getMappingId())
                .projectName(urlMapping.getProjectName())
                .shortUrl(shortBaseUrl + urlMapping.getShortCode())
                .longUrl(urlMapping.getLongUrl().toString())
                .owner(urlMapping.getOwner().getUsername())
                .expiresAt(urlMapping.getExpiresAt())
                .active(isActive(urlMapping) && !isExpired(urlMapping))
                .uniqueViews(uniqueViewService.count(urlMapping.getMappingId()))
                .build();
    }

    public static String normalizeCustomCode(String code) {
        String normalized = code.trim();
        if (!CUSTOM_CODE_PATTERN.matcher(normalized).matches()) {
            throw new InValidShortCode("Custom short codes must be 3-32 letters, numbers, hyphens, or underscores");
        }
        return normalized;
    }

    private String generateAvailableRandomCode() {
        for (int attempt = 0; attempt < 20; attempt++) {
            StringBuilder code = new StringBuilder(12);
            for (int i = 0; i < 12; i++) {
                code.append(SHORT_CODE_ALPHABET.charAt(SECURE_RANDOM.nextInt(SHORT_CODE_ALPHABET.length())));
            }
            if (isShortCodeAvailable(code.toString())) {
                return code.toString();
            }
        }
        throw new UrlCreationException("Could not allocate a unique short code");
    }

    private URL parseHttpUrl(String value) throws MalformedURLException {
        URL url = new URL(value);
        if (!"http".equalsIgnoreCase(url.getProtocol()) && !"https".equalsIgnoreCase(url.getProtocol())) {
            throw new IllegalArgumentException("Only HTTP and HTTPS destination URLs are supported");
        }
        return url;
    }

    private RedisMappingDTO toRedirectDetails(UrlMapping mapping) {
        return RedisMappingDTO.builder()
                .mappingId(mapping.getMappingId())
                .longUrl(mapping.getLongUrl().toString())
                .isProtected(mapping.getUrlConfig() != null && mapping.getUrlConfig().isProtected())
                .active(isActive(mapping) && !isExpired(mapping))
                .expiresAtEpochMillis(mapping.getExpiresAt() == null ? null : mapping.getExpiresAt().toEpochMilli())
                .build();
    }

    public boolean isAvailableForRedirect(RedisMappingDTO details) {
        return details.isActive()
                && (details.getExpiresAtEpochMillis() == null
                || details.getExpiresAtEpochMillis() > System.currentTimeMillis());
    }

    public void requireOwner(UrlMapping mapping, String userId) {
        if (mapping.getOwner() == null || !mapping.getOwner().getUserId().equals(userId)) {
            throw new AccessDeniedException("You are not allowed to access this link");
        }
    }

    private boolean isActive(UrlMapping mapping) {
        return mapping.getUrlConfig() == null || mapping.getUrlConfig().isActive();
    }

    private boolean isExpired(UrlMapping mapping) {
        return mapping.getExpiresAt() != null && !mapping.getExpiresAt().isAfter(Instant.now());
    }

    private String cacheKey(String shortCode) {
        return REDIRECT_CACHE_PREFIX + shortCode;
    }

    public Map<Object, Object> getAnalysis(String mappingId){
        try{
            Map<Object,Object> analyticMap= analyticRedisTemplate.opsForHash().entries("analytic:"+mappingId);
            if(analyticMap.isEmpty()){
                // try to get the analytic from the database
                synchronized (this) {
//                    Map<String, Long> countryTotalCount = mappingRepository.getCountryAndTotalCount();
//                    Map<String, Long> deviceTypeAndReferer = mappingRepository.getDeviceTypeAndRefferer();

                    Map<Object, Object> finalOutput = new HashMap<>();
//                    finalOutput.putAll(countryTotalCount);
//                    finalOutput.putAll(deviceTypeAndReferer);
                    analyticRedisTemplate.opsForHash().putAll("analytic:" + mappingId, finalOutput);
                    analyticRedisTemplate.expire("analytic:"+mappingId, Duration.ofHours(1));
                    return finalOutput;
                }

            }
            return analyticMap;
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
