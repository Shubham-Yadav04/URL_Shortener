package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.DTO.KafkaDTO;
import com.example.Url_Shortener.DTO.RedisMappingDTO;
import com.example.Url_Shortener.DTO.VerifyPasswordDTO;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.ProtectedRoute;
import com.example.Url_Shortener.Modal.UrlMapping;
import com.example.Url_Shortener.Repository.MappingRepository;
import com.example.Url_Shortener.Services.RedirectProducer;
import com.example.Url_Shortener.Services.UrlSecurityService;
import com.example.Url_Shortener.Services.UtilService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.PredicateSpecification;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UrlSecurityController {

    private final UrlSecurityService securityService;
    private  final MappingRepository mappingRepository;
    private final RedirectProducer redirectProducer;
    private final UtilService utilService;
    private final RedisTemplate<String, RedisMappingDTO> redisTemplate;

    @PostMapping("/{id}/protect")
    public ResponseEntity<?> protectUrl(
            @PathVariable Long id,
            @RequestBody String password) {

        securityService.protectUrl(id, password);
        return ResponseEntity.ok("URL protected successfully");
    }

    @PostMapping("/{id}/unprotect")
    public ResponseEntity<?> unprotectUrl(@PathVariable Long id) {

        securityService.removeProtection(id);
        return ResponseEntity.ok("Protection removed");
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody String password) {

        securityService.changePassword(id, password);
        return ResponseEntity.ok("Password updated");
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activate(@PathVariable Long id) {

        securityService.activateUrl(id);
        return ResponseEntity.ok("URL activated");
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivate(@PathVariable Long id) {

        securityService.deactivateUrl(id);
        return ResponseEntity.ok("URL deactivated");
    }

    @PostMapping("/verify")
    public void verify(
            VerifyPasswordDTO verifyPasswordDTO,
            HttpServletResponse response,
            HttpServletRequest request
            ) throws IOException {
        UrlMapping mapping= mappingRepository.findByShortCode(verifyPasswordDTO.getShortCode()).orElseThrow();
        boolean valid = securityService.verifyPassword(mapping,verifyPasswordDTO.getPassword());
if(valid){
    redirectProducer.produceRedirect(KafkaDTO.builder()
            .mappingId(mapping.getMappingId())
                    .date(LocalDateTime.now())
            .deviceType(request.getHeader("deviceType"))
                    .country(request.getHeader("country"))
            .referrer(request.getHeader("Referer"))
            .build());
    response.sendRedirect(mapping.getLongUrl().toString());
}

throw new ProtectedRoute("unauthorized ");
    }
}
