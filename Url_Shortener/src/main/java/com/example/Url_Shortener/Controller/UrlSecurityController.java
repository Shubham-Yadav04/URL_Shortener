package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.DTO.CustomUserDetails;
import com.example.Url_Shortener.DTO.KafkaDTO;
import com.example.Url_Shortener.DTO.PasswordRequestDTO;
import com.example.Url_Shortener.DTO.VerifyPasswordDTO;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.ProtectedRoute;
import com.example.Url_Shortener.Modal.UrlMapping;
import com.example.Url_Shortener.Repository.MappingRepository;
import com.example.Url_Shortener.Services.MappingService;
import com.example.Url_Shortener.Services.RedirectProducer;
import com.example.Url_Shortener.Services.RequestService;
import com.example.Url_Shortener.Services.UniqueViewService;
import com.example.Url_Shortener.Services.VisitorCookieService;
import com.example.Url_Shortener.Services.UrlSecurityService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class UrlSecurityController {

    private final UrlSecurityService securityService;
    private final MappingRepository mappingRepository;
    private final MappingService mappingService;
    private final RedirectProducer redirectProducer;
    private final RequestService requestService;
    private final UniqueViewService uniqueViewService;
    private final VisitorCookieService visitorCookieService;

    @PostMapping("/{id}/protect")
    public ResponseEntity<?> protectUrl(
            @PathVariable Long id,
            @RequestBody PasswordRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails user) {
        securityService.protectUrl(id, request.getPassword(), user.getId());
        return ResponseEntity.ok("URL protected successfully");
    }

    @PostMapping("/{id}/unprotect")
    public ResponseEntity<?> unprotectUrl(@PathVariable Long id,
                                          @AuthenticationPrincipal CustomUserDetails user) {
        securityService.removeProtection(id, user.getId());
        return ResponseEntity.ok("Protection removed");
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody PasswordRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails user) {
        securityService.changePassword(id, request.getPassword(), user.getId());
        return ResponseEntity.ok("Password updated");
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activate(@PathVariable Long id,
                                      @AuthenticationPrincipal CustomUserDetails user) {
        securityService.activateUrl(id, user.getId());
        return ResponseEntity.ok("URL activated");
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivate(@PathVariable Long id,
                                        @AuthenticationPrincipal CustomUserDetails user) {
        securityService.deactivateUrl(id, user.getId());
        return ResponseEntity.ok("URL deactivated");
    }

    @PostMapping("/verify")
    public void verify(
            @ModelAttribute VerifyPasswordDTO verifyPasswordDTO,
            HttpServletResponse response,
            HttpServletRequest request) throws IOException {
        UrlMapping mapping = mappingRepository.findByShortCode(verifyPasswordDTO.getShortCode()).orElseThrow();
        var redirectDetails = mappingService.getRedirectDetails(verifyPasswordDTO.getShortCode());
        if (!mappingService.isAvailableForRedirect(redirectDetails)) {
            response.sendError(HttpServletResponse.SC_GONE, "This link has expired or has been deactivated");
            return;
        }
        if (!securityService.verifyPassword(mapping, verifyPasswordDTO.getPassword())) {
            throw new ProtectedRoute("Incorrect password");
        }
        String country = requestService.resolveCountry(request);
        String device = requestService.resolveDeviceType(request);
        String referrer = request.getHeader("Referer");
        String visitorId = visitorCookieService.resolveVisitorId(request, response);
        recordRedirect(mapping, visitorId, country, device, referrer);
        response.sendRedirect(mapping.getLongUrl().toString());
    }

    private void recordRedirect(UrlMapping mapping, String visitorId,
                                String country, String device, String referrer) {
        redirectProducer.produceRedirect(KafkaDTO.builder()
                .mappingId(mapping.getMappingId())
                .date(LocalDateTime.now())
                .deviceType(device)
                .country(country)
                .referrer(referrer)
                .build());
        uniqueViewService.record(mapping.getMappingId(), visitorId);
    }
}
