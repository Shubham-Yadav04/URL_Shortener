package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.DTO.KafkaDTO;
import com.example.Url_Shortener.DTO.RedisMappingDTO;

import com.example.Url_Shortener.Services.MappingService;
import com.example.Url_Shortener.Services.RedirectProducer;
import com.example.Url_Shortener.Services.RequestService;
import com.example.Url_Shortener.Services.UniqueViewService;
import com.example.Url_Shortener.Services.VisitorCookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@Controller
public class RedirectionController {

    private final MappingService mappingService;
    private final RedirectProducer redirectProducer;
    private final RequestService requestService;
    private final UniqueViewService uniqueViewService;
    private final VisitorCookieService visitorCookieService;

    @GetMapping("/r/{shortCode}")
    public String getMapping(
            @PathVariable String shortCode, HttpServletRequest request, HttpServletResponse response, Model model) throws IOException {
        RedisMappingDTO details = mappingService.getRedirectDetails(shortCode);
        if (!mappingService.isAvailableForRedirect(details)) {
            response.sendError(HttpServletResponse.SC_GONE, "This link has expired or has been deactivated");
            return null;
        }
        if (Boolean.TRUE.equals(details.getIsProtected())) {
            model.addAttribute("shortCode", shortCode);
            model.addAttribute("referrer", request.getHeader("Referer"));
            model.addAttribute("country", requestService.resolveCountry(request));
            model.addAttribute("device", requestService.resolveDeviceType(request));
            return "PasswordVerification";
        }

        String country = requestService.resolveCountry(request);
        String device = requestService.resolveDeviceType(request);
        String referrer = request.getHeader("Referer");
        String visitorId = visitorCookieService.resolveVisitorId(request, response);
        recordRedirect(details.getMappingId(), visitorId, country, device, referrer);
        return "redirect:" + details.getLongUrl();
    }

    private void recordRedirect(Long mappingId, String visitorId,
                                String country, String device, String referrer) {
        redirectProducer.produceRedirect(KafkaDTO.builder()
                .mappingId(mappingId)
                .date(LocalDateTime.now())
                .deviceType(device)
                .country(country)
                .referrer(referrer)
                .build());
        uniqueViewService.record(mappingId, visitorId);
    }
}
