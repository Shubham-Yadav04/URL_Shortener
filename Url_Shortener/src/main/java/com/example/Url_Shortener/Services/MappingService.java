package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.DTO.UrlMappingDTO;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.ResourceNotFoundException;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.UrlCreationException;
import com.example.Url_Shortener.Modal.UrlConfig;
import com.example.Url_Shortener.Modal.UrlMapping;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Repository.MappingRepository;
import com.example.Url_Shortener.Repository.UserRepository;

import com.example.Url_Shortener.Utils.BaseEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

import java.util.stream.Collectors;

@Service
public class MappingService {
    private final MappingRepository mappingRepository;
    private final UserRepository userRepository;
private final StringRedisTemplate stringRedisTemplate;
private final UtilService utilService;


@Value("${Base_URL")
private String baseUrl;
    public MappingService(MappingRepository mappingRepository,
                                 UserRepository userRepository,
                          StringRedisTemplate stringRedisTemplate,
                          UtilService utilService
                          ) {
        this.mappingRepository = mappingRepository;
        this.userRepository = userRepository;
        this.stringRedisTemplate = stringRedisTemplate;
        this.utilService=utilService;

    }

    @Transactional
    public UrlMappingDTO createShortUrl(String userId, URL longUrl, String code) {

        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));


        UrlMapping mapping =  mappingRepository.save(UrlMapping.builder()
                .longUrl(longUrl)
                .owner(owner)
                .build());
        try {
            String shortCode="";
            if(!code.trim().isEmpty()){
shortCode=code;
            }
            else  shortCode = BaseEncoder.encode( (mapping.getMappingId()+ (long) (Math.random() * 100)));
            URL shortUrl= new URL(baseUrl+shortCode);
          mapping.setShortCode(shortCode);
            UrlConfig urlConfig= new UrlConfig();
              byte [] qrCode=generateQR(shortUrl.toString());
              urlConfig.setQrCode(qrCode);
          mapping.setUrlConfig(urlConfig);
             mappingRepository.save(mapping);

             return UrlMappingDTO.builder()
                     .mappingId(mapping.getMappingId())
                     .qrCode(qrCode)
                     .owner(userId)
                     .longUrl(longUrl.toString())
                     .shortUrl(shortUrl.toString())
                     .build();

        } catch (MalformedURLException e) {
            mappingRepository.delete(mapping);
            throw new UrlCreationException("Failed to create short URL");
        }
    }

    @Transactional(readOnly = true)
    public UrlMappingDTO getMappingById(Long mappingId) {

        UrlMapping mapping= mappingRepository.findById(mappingId)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found"));
       return convertMappingToDTO(mapping);
    }

    @Transactional(readOnly = true)

    public UrlMapping getByShortCode(String shortCode) {
        return mappingRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found"));
    }

    @Transactional(readOnly = true)
    public List<UrlMappingDTO> getUserMappings(String userId) {

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        return mappingRepository.findByOwnerUserId(userId).stream().map(this::convertMappingToDTO
                ).collect(Collectors.toList());
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

    public byte[] generateQR(String shortCode) {
        try{
            String shortUrl= baseUrl+"/r"+shortCode;
            return utilService.generateQRCode(shortUrl);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
    public UrlMappingDTO convertMappingToDTO(UrlMapping urlMapping){
        return UrlMappingDTO.builder()
                .isProtected(urlMapping.getUrlConfig().isProtected())
                .qrCode(urlMapping.getUrlConfig().getQrCode())
                .shortUrl(baseUrl+urlMapping.getShortCode())
                .longUrl(urlMapping.getLongUrl().toString())
                .uniqueCount(urlMapping.getUniqueCount())
                .owner(urlMapping.getOwner().getUsername())
                .build();
    }
}
