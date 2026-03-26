package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.DTO.RedisMappingDTO;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.QRCodeGenerationError;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.RedirectionException;
import com.example.Url_Shortener.Modal.UrlMapping;
import com.example.Url_Shortener.Services.MappingService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URL;

@RequiredArgsConstructor
@RestController
public class RedirectionController {

    private final MappingService mappingService;
    private final StringRedisTemplate stringRedisTemplate;
    private final RedisTemplate<String, RedisMappingDTO> redisTemplate;

    @GetMapping("/r/{shortCode}")
    public void getMapping(
            @PathVariable String shortCode, HttpServletResponse response) throws IOException {
        RedisMappingDTO cache=redisTemplate.opsForValue().get(shortCode);
        if(cache!=null) response.sendRedirect(cache.getLongUrl());
        else {
            UrlMapping mapping =
                    mappingService.getByShortCode(shortCode);
            if (mapping.getLongUrl() != null) {
                redisTemplate.opsForValue().set(shortCode,
                        RedisMappingDTO.builder()
                                .isProtected(mapping.getUrlConfig().isProtected())
                                .uniqueCount(mapping.getUniqueCount())
                                .longUrl(mapping.getLongUrl().toString())
                                .qrCode(mapping.getUrlConfig().getQrCode())
                                .build()
                        );
                response.sendRedirect(mapping.getLongUrl().toString());
            } else throw new RedirectionException("Redirection Failed");
        }
    }
    @GetMapping("/qr/{shortCode}")
    public ResponseEntity<byte[]> getQrForURL(@PathVariable("shortCode") String shortCode){
        try{
            byte[] qrCode= mappingService.generateQR(shortCode);
            return new ResponseEntity<>(qrCode, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            throw new QRCodeGenerationError(e.getMessage());
        }

    }
}
