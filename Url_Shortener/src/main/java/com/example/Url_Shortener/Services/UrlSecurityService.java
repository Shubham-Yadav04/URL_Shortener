package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.ExceptionHandler.Exceptions.ResourceNotFoundException;
import com.example.Url_Shortener.Modal.UrlConfig;
import com.example.Url_Shortener.Modal.UrlMapping;
import com.example.Url_Shortener.Repository.MappingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UrlSecurityService {

    private final MappingRepository mappingRepository;
    private final PasswordEncoder passwordEncoder;

    public void protectUrl(Long mappingId, String rawPassword) {

        UrlMapping mapping = mappingRepository.findById(mappingId)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found"));

        UrlConfig config = mapping.getUrlConfig();
        if (config == null) {
            config = new UrlConfig();
        }

        config.setProtected(true);
        config.setPasswordHash(passwordEncoder.encode(rawPassword));

        mapping.setUrlConfig(config);
    }

    public void removeProtection(Long mappingId) {

        UrlMapping mapping = mappingRepository.findById(mappingId)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found"));

        UrlConfig config = mapping.getUrlConfig();

        if (config != null) {
            config.setProtected(false);
            config.setPasswordHash(null);
        }
    }

    public void changePassword(Long mappingId, String newPassword) {

        UrlMapping mapping = mappingRepository.findById(mappingId)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found"));

        UrlConfig config = mapping.getUrlConfig();

        if (config == null || !config.isProtected()) {
            throw new RuntimeException("URL is not protected");
        }

        config.setPasswordHash(passwordEncoder.encode(newPassword));
    }

    public void activateUrl(Long mappingId) {

        UrlMapping mapping = mappingRepository.findById(mappingId)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found"));

        mapping.getUrlConfig().setActive(true);
    }

    public void deactivateUrl(Long mappingId) {

        UrlMapping mapping = mappingRepository.findById(mappingId)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found"));

        mapping.getUrlConfig().setActive(false);
    }

    public boolean verifyPassword(UrlMapping mapping, String rawPassword) {

        UrlConfig config = mapping.getUrlConfig();

        if (config == null || !config.isProtected()) {
            return true; // no password required
        }

        return passwordEncoder.matches(rawPassword, config.getPasswordHash());
    }
}
