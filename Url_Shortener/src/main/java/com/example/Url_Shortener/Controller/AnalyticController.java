package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.DTO.AnalyticSummaryDTO;
import com.example.Url_Shortener.DTO.DailyCountDTO;
import com.example.Url_Shortener.Repository.AnalyticRepository;
import com.example.Url_Shortener.Services.AnalyticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/7Day/{mappingId}")
    public List<DailyCountDTO> last7DayAnalysis(@PathVariable("mappingId") String mappingId){
        try{
            return analyticService.last7DayAnalysis(mappingId);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
@GetMapping("/summary/{mappingId}")
    public ResponseEntity<AnalyticSummaryDTO> getAnalysisSummary(@PathVariable("mappingId") String mappingId){
        try{
            System.out.println("in Analytic summary");
            AnalyticSummaryDTO analyticSummaryDTO= analyticService.getAnalyticSummary(mappingId);
            if(analyticSummaryDTO!=null) return new ResponseEntity<>(analyticSummaryDTO, HttpStatus.OK);

            return new ResponseEntity<>(new AnalyticSummaryDTO(), HttpStatus.ACCEPTED);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

    }


}
