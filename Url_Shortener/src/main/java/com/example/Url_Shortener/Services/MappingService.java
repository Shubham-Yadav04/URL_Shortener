package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.Modal.UrlMapping;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Repository.MappingRepository;
import com.example.Url_Shortener.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.List;
import java.util.UUID;

@Service
public class MappingService {
    private final MappingRepository mappingRepository;
    private final UserRepository userRepository;

    public MappingService(MappingRepository mappingRepository,
                                 UserRepository userRepository) {
        this.mappingRepository = mappingRepository;
        this.userRepository = userRepository;
    }


    public UrlMapping createShortUrl(String userId, URL longUrl) {

        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String shortCode = UUID.randomUUID().toString().substring(0, 8);

        URL shortUrl;
        try {
            shortUrl = new URL("http://localhost:8080/r/" + shortCode);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create short URL");
        }

        UrlMapping mapping = new UrlMapping();
        mapping.setLongUrl(longUrl);
        mapping.setShortUrl(shortUrl);
        mapping.setOwner(owner);

        return mappingRepository.save(mapping);
    }


    public UrlMapping getMappingById(String mappingId) {
        return mappingRepository.findById(mappingId)
                .orElseThrow(() -> new RuntimeException("Mapping not found"));
    }


    public UrlMapping getByShortUrl(URL shortUrl) {
        return mappingRepository.findByShortUrl(shortUrl)
                .orElseThrow(() -> new RuntimeException("Short URL not found"));
    }


    public List<UrlMapping> getUserMappings(String userId) {

        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return owner.getMappedUrl();
    }


    public void deleteMapping(String mappingId) {

        UrlMapping mapping = mappingRepository.findById(mappingId)
                .orElseThrow(() -> new RuntimeException("Mapping not found"));

        mappingRepository.delete(mapping);
    }

}
