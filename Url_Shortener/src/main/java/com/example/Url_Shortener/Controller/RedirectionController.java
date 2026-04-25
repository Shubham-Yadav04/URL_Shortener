package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.DTO.KafkaDTO;
import com.example.Url_Shortener.DTO.RedisMappingDTO;

import com.example.Url_Shortener.Modal.UrlMapping;
import com.example.Url_Shortener.Services.MappingService;
import com.example.Url_Shortener.Services.RedirectProducer;
import com.example.Url_Shortener.Services.UtilService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor
@Controller
public class RedirectionController {

    private final MappingService mappingService;
    private final StringRedisTemplate stringRedisTemplate;
    private final RedisTemplate<String, RedisMappingDTO> redisTemplate;
    private final RedirectProducer redirectProducer;
    private final UtilService utilService;

    @GetMapping("/r/{shortCode}")
    public String getMapping(
            @PathVariable String shortCode, HttpServletRequest request, HttpServletResponse response, Model model) throws IOException {
        RedisMappingDTO cache=redisTemplate.opsForValue().get(shortCode);
    if (cache != null) {
        System.out.println(cache.toString());
        if (cache.getIsProtected() != null && cache.getIsProtected()) {
            // then provide a page asking for the password then verify the submission if ok the redirect
            model.addAttribute("shortCode", shortCode);
            return "PasswordVerification";
        }

//        redirectProducer.produceRedirect(KafkaDTO.builder()
//                .mappingId(cache.getMappingId())
//                        .date(LocalDateTime.now())
//                .deviceType(request.getHeader("deviceType"))
//                .country(request.getHeader("country"))
//                .referrer(request.getHeader("Referer"))
//                .build());
       return "redirect:"+cache.getLongUrl();
    } else {
        UrlMapping mapping =
                mappingService.getByShortCode(shortCode);
        if (mapping.getUrlConfig().isProtected()) {
            model.addAttribute("shortCode", shortCode);
            return "PasswordVerification";
        }
        if (mapping.getLongUrl() != null) {
            redisTemplate.opsForValue().set(shortCode,
                    RedisMappingDTO.builder()
                            .mappingId(mapping.getMappingId())
                            .isProtected(mapping.getUrlConfig().isProtected())
                            .longUrl(mapping.getLongUrl().toString())

                            .build()
                    ,
                    20, TimeUnit.MINUTES
            );
            // before actual redirect create a redirectEvent in kafka.
//            redirectProducer.produceRedirect(KafkaDTO.builder()
//                            .date(LocalDateTime.now())
//                    .mappingId(mapping.getMappingId())
//                    .deviceType(request.getHeader("deviceType"))
//                    .country(request.getHeader("country"))
//                    .referrer(request.getHeader("Referer"))
//                    .build());
            return "redirect:" + mapping.getLongUrl().toString();
        }
    }
throw new  RuntimeException("error in redirect");
    }
//    @ResponseBody
//    @GetMapping("/qr/{shortCode}")
//    public ResponseEntity<byte[]> getQrForURL(@PathVariable("shortCode") String shortCode){
//        try{
//            byte[] qrCode= mappingService.generateQR(shortCode);
//            return new ResponseEntity<>(qrCode, HttpStatus.CREATED);
//        } catch (RuntimeException e) {
//            throw new QRCodeGenerationError(e.getMessage());
//        }
//
//    }
}
