package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.DTO.CreateRequestDTO;
import com.example.Url_Shortener.DTO.CustomUserDetails;
import com.example.Url_Shortener.DTO.MappingListDTO;
import com.example.Url_Shortener.DTO.ShortCodeAvailabilityDTO;
import com.example.Url_Shortener.DTO.UrlMappingDTO;
import com.example.Url_Shortener.Records.CountryAnalytic;
import com.example.Url_Shortener.Records.DeviceAnalytic;
import com.example.Url_Shortener.Records.PlatformAnalytic;
import com.example.Url_Shortener.Repository.AnalyticRepository;
import com.example.Url_Shortener.Repository.CountrySummaryRepository;
import com.example.Url_Shortener.Services.CountryAnalyticService;
import com.example.Url_Shortener.Services.DeviceSummaryService;
import com.example.Url_Shortener.Services.MappingService;
import com.example.Url_Shortener.Services.PlatformSummaryService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("mapping")

public class MappingController {


    private final MappingService mappingService;

    private final DeviceSummaryService deviceSummaryService;
    private final PlatformSummaryService platformSummaryService;
    private final CountryAnalyticService countrySummaryService;
private  final RedisTemplate<String,Object> redisTemplate;

    public MappingController(MappingService mappingService, DeviceSummaryService deviceSummaryService, PlatformSummaryService platformSummaryService, CountryAnalyticService countrySummaryService, @Qualifier("analytic") RedisTemplate<String,Object> redisTemplate) {
        this.mappingService = mappingService;
        this.deviceSummaryService = deviceSummaryService;
        this.platformSummaryService = platformSummaryService;
        this.countrySummaryService = countrySummaryService;
        this.redisTemplate=redisTemplate;
    }

    @GetMapping("/health-check")
    public String healthCheck(){
        return "mapping working";
    }
    @PostMapping({"/shorten", "/shorten/{userId}"})
    public ResponseEntity<UrlMappingDTO> createShortUrl(
            @PathVariable(required = false) String userId,
            @RequestBody CreateRequestDTO requestDTO,
            @AuthenticationPrincipal CustomUserDetails user) throws java.net.MalformedURLException {
        if (userId != null && !user.getId().equals(userId)) {
            throw new AccessDeniedException("You cannot create links for another account");
        }
        return ResponseEntity.ok(mappingService.createShortUrl(user.getId(), requestDTO));
    }

    @GetMapping("/short-code/availability")
    public ResponseEntity<ShortCodeAvailabilityDTO> checkShortCodeAvailability(
            @RequestParam String code) {
        String normalizedCode = MappingService.normalizeCustomCode(code);
        return ResponseEntity.ok(new ShortCodeAvailabilityDTO(
                normalizedCode,
                mappingService.isShortCodeAvailable(normalizedCode)));
    }

    @GetMapping("/{mappingId}")
    public ResponseEntity<UrlMappingDTO> getMapping(
            @PathVariable Long mappingId,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(mappingService.getMappingById(mappingId, user.getId()));
    }

    @GetMapping("/user")
    public ResponseEntity<List<MappingListDTO>> getCurrentUserMappings(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(mappingService.getUserMappings(user.getId()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MappingListDTO>> getUserMappings(
            @PathVariable String userId,
            @AuthenticationPrincipal CustomUserDetails user) {
        if (!user.getId().equals(userId)) {
            throw new AccessDeniedException("You cannot view another user's links");
        }
        return ResponseEntity.ok(mappingService.getUserMappings(user.getId()));
    }

    @PutMapping("/{shortCode}")
    public ResponseEntity<String> updatingLongUrl(
            @PathVariable("shortCode") String shortCode,
            @RequestParam("longUrl") String longUrl,
            @AuthenticationPrincipal CustomUserDetails user) throws java.net.MalformedURLException {
        return ResponseEntity.ok(mappingService.updateLongUrl(shortCode, longUrl, user.getId()));
    }

    @GetMapping("/day/analysis/{mappingId}")
    public ResponseEntity<?> get24hrAnalysis(
            @PathVariable("mappingId") String mappingId,
            @AuthenticationPrincipal CustomUserDetails user) {
        mappingService.getOwnedMapping(Long.valueOf(mappingId), user.getId());
        Map<Object, Object> map = redisTemplate.opsForHash().entries("hash:" + mappingId);
        if (!map.isEmpty()) {
            return new ResponseEntity<>(map, HttpStatus.OK);
        }
        return new ResponseEntity<>("no analysis", HttpStatus.NOT_FOUND);
    }


//@GetMapping("/analysis/{mappingId}")
//public ResponseEntity<?> getAnalysis(@PathVariable("mappingId") String mappingId){
//        try{
//            return mappingService.getAnalysis(mappingId);
//        } catch (RuntimeException e) {
//            throw new RuntimeException(e);
//        }
//}
    @DeleteMapping("/{mappingId}")
    public ResponseEntity<Void> deleteMapping(
            @PathVariable Long mappingId,
            @AuthenticationPrincipal CustomUserDetails user) {
        mappingService.getOwnedMapping(mappingId, user.getId());
        mappingService.deleteMapping(mappingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{mappingId}/country/")
    public List<CountryAnalytic> getCountryWiseAnalytic(
            @PathVariable("mappingId") String mappingId,
            @AuthenticationPrincipal CustomUserDetails user) {
        mappingService.getOwnedMapping(Long.valueOf(mappingId), user.getId());
        return countrySummaryService.getCountryBasedAnalysis(mappingId);
    }

    @GetMapping("/{mappingId}/device/")
    public List<DeviceAnalytic> getDeviceWiseAnalytic(
            @PathVariable("mappingId") String mappingId,
            @AuthenticationPrincipal CustomUserDetails user) {
        mappingService.getOwnedMapping(Long.valueOf(mappingId), user.getId());
        return deviceSummaryService.getDeviceAnalyticByMappingId(mappingId);
    }

    @GetMapping("/{mappingId}/platform/")
    public List<PlatformAnalytic> getPlatformWiseAnalytic(
            @PathVariable("mappingId") String mappingId,
            @AuthenticationPrincipal CustomUserDetails user) {
        mappingService.getOwnedMapping(Long.valueOf(mappingId), user.getId());
        return platformSummaryService.getPlatformAnalyticByMappingId(mappingId);
    }
}
