package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.ExceptionHandler.Exceptions.ResourceNotFoundException;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.UrlCreationException;
import com.example.Url_Shortener.Modal.UrlMapping;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Repository.MappingRepository;
import com.example.Url_Shortener.Repository.UserRepository;

import com.example.Url_Shortener.Utils.BaseEncoder;
import org.springframework.cache.annotation.CachePut;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.UUID;

@Service
public class MappingService {
    private final MappingRepository mappingRepository;
    private final UserRepository userRepository;
private final StringRedisTemplate stringRedisTemplate;

    public MappingService(MappingRepository mappingRepository,
                                 UserRepository userRepository,
                          StringRedisTemplate stringRedisTemplate
                          ) {
        this.mappingRepository = mappingRepository;
        this.userRepository = userRepository;
        this.stringRedisTemplate = stringRedisTemplate;

    }

    @Transactional
    public URL createShortUrl(String userId, URL longUrl) {

        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UrlMapping mapping =  mappingRepository.save(UrlMapping.builder()
                .longUrl(longUrl)
                .owner(owner)
                .build());


        try {
          String  shortCode = BaseEncoder.encode( (mapping.getMappingId()+ (long) (Math.random() * 100)));
            URL shortUrl= new URL("http://localhost:8080/r/"+shortCode);
          mapping.setShortCode(shortCode);
             mappingRepository.save(mapping);
             return shortUrl;
        } catch (MalformedURLException e) {
            mappingRepository.delete(mapping);
            throw new UrlCreationException("Failed to create short URL");
        }
    }

    @Transactional(readOnly = true)
    public UrlMapping getMappingById(Long mappingId) {

        return mappingRepository.findById(mappingId)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found"));
    }

    @Transactional(readOnly = true)

    public UrlMapping getByShortCode(String shortCode) {
        return mappingRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found"));
    }

    @Transactional(readOnly = true)
    public List<UrlMapping> getUserMappings(String userId) {

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }

        return mappingRepository.findByOwnerUserId(userId);
    }

    public void deleteMapping(Long mappingId) {
        UrlMapping mapping = mappingRepository.findById(mappingId)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found"));
stringRedisTemplate.opsForValue().getAndDelete(mapping.getShortCode());
        mappingRepository.delete(mapping);
    }
    @Transactional

    public String updateLongUrl(String shortCode,String longUrl) throws Exception{
        try{
            UrlMapping mapping= mappingRepository.findByShortCode(shortCode).orElseThrow();
            mapping.setLongUrl(new URL(longUrl));
            stringRedisTemplate.opsForValue().set(shortCode,longUrl);
            mappingRepository.save(mapping);
            return longUrl;
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
