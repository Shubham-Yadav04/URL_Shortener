package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.DTO.CreateRequestDTO;
import com.example.Url_Shortener.DTO.MappingListDTO;
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

import com.example.Url_Shortener.Utils.BaseEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;

import org.springframework.security.crypto.password.PasswordEncoder;
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
//private final UtilService utilService;
private final UrlConfigRepository urlConfigRepository;

@Autowired
    PasswordEncoder passwordEncoder;

@Value("${Base_Short_URL}")
private String shortBaseUrl;
    public MappingService(MappingRepository mappingRepository,
                                 UserRepository userRepository,
                          StringRedisTemplate stringRedisTemplate,
//                          UtilService utilService,
                          UrlConfigRepository urlConfigRepository

                          ) {
        this.mappingRepository = mappingRepository;
        this.userRepository = userRepository;
        this.stringRedisTemplate = stringRedisTemplate;
//        this.utilService=utilService;

        this.urlConfigRepository=urlConfigRepository;

    }

    @Transactional
    public UrlMappingDTO createShortUrl(String userId, CreateRequestDTO request) throws MalformedURLException {

        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String password= request.getPassword();
        String code=request.getShortCode();
        String longUrl= request.getLongURL();
        String projectName= request.getProjectName();
        boolean isProtected= request.getIsProtected() != null;
      if(mappingRepository.findByShortCode(code).isPresent()) throw new InValidShortCode("short code already exists");
      UrlMapping mapping =  mappingRepository.save(UrlMapping.builder()
                .longUrl(new URL(longUrl))
                .owner(owner)
                      .projectName(projectName)
                .build());
        try {
            String shortCode="";
            if(code!=null && !code.isEmpty()){
shortCode=code.trim();
            }
            else  shortCode = BaseEncoder.encode( (mapping.getMappingId()+ (long) (Math.random() * 100)));
            URL shortUrl= new URL(shortBaseUrl+shortCode);
          mapping.setShortCode(shortCode);
//              byte [] qrCode=generateQR(shortCode);
              UrlConfig requestURLConfig= UrlConfig.builder().isProtected(isProtected).build();
              if(isProtected) {
                  String passwordHash= passwordEncoder.encode(password);
                  requestURLConfig.setPasswordHash(passwordHash);
              }
             UrlConfig urlConfig= urlConfigRepository.save(requestURLConfig);
          mapping.setUrlConfig(urlConfig);

             mappingRepository.save(mapping);

             return UrlMappingDTO.builder()
                     .mappingId(mapping.getMappingId())

                     .owner(userId)
                     .longUrl(longUrl)
                     .shortUrl(shortUrl.toString())
                     .build();

        } catch (MalformedURLException e) {
            mappingRepository.delete(mapping);
            throw new UrlCreationException("Failed to create short URL"+ e.getMessage());
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
    public List<MappingListDTO> getUserMappings(String userId) {

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        return mappingRepository.findByOwnerUserId(userId).stream().map(project->MappingListDTO.builder().id(project.getMappingId()).name(project.getProjectName()).build()
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
                .isProtected(urlMapping.getUrlConfig().isProtected())
                .mappingId(urlMapping.getMappingId())
                .projectName(urlMapping.getProjectName())
                .shortUrl(shortBaseUrl+urlMapping.getShortCode())
                .longUrl(urlMapping.getLongUrl().toString())
                .uniqueCount(urlMapping.getUniqueCount())
                .owner(urlMapping.getOwner().getUsername())
                .build();
    }
}
