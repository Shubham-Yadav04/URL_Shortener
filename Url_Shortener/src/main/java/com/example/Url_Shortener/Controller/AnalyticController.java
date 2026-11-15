package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.DTO.AnalyticSummaryDTO;
import com.example.Url_Shortener.DTO.DailyCountDTO;
import com.example.Url_Shortener.DTO.CustomUserDetails;
import com.example.Url_Shortener.Services.MappingService;
import com.example.Url_Shortener.Services.UniqueViewService;
import com.example.Url_Shortener.Services.AnalyticService;
import com.example.Url_Shortener.Services.AnalyticSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("analytic")
@RequiredArgsConstructor
public class AnalyticController {
    private final AnalyticService analyticService;
    private final AnalyticSummaryService analyticSummaryService;
    private final MappingService mappingService;
    private final UniqueViewService uniqueViewService;

    @GetMapping("/7Day/{mappingId}")
    public List<DailyCountDTO> last7DayAnalysis(
            @PathVariable("mappingId") Long mappingId,
            @AuthenticationPrincipal CustomUserDetails user) {
        mappingService.getOwnedMapping(mappingId, user.getId());
        return analyticService.last7DayAnalysis(mappingId);
    }

    @GetMapping("/summary/{mappingId}")
    public ResponseEntity<AnalyticSummaryDTO> getAnalysisSummary(
            @PathVariable("mappingId") Long mappingId,
            @AuthenticationPrincipal CustomUserDetails user) {
        mappingService.getOwnedMapping(mappingId, user.getId());
        AnalyticSummaryDTO summary = analyticSummaryService.getSummary(mappingId);
        if (summary == null) {
            summary = new AnalyticSummaryDTO();
        }
        summary.setUniqueViews(uniqueViewService.count(mappingId));
        return new ResponseEntity<>(summary, HttpStatus.OK);
    }
}
