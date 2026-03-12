package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.Modal.UrlMapping;
import com.example.Url_Shortener.Services.MappingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.List;

@RestController
public class MappingController {


    private final MappingService mappingService;

    public MappingController(MappingService mappingService) {
        this.mappingService = mappingService;
    }

    @PostMapping("/shorten/{userId}")
    public ResponseEntity<UrlMapping> createShortUrl(
            @PathVariable String userId,
            @RequestParam URL longUrl) {

        return ResponseEntity.ok(
                mappingService.createShortUrl(userId, longUrl)
        );
    }

    @GetMapping("/{mappingId}")
    public ResponseEntity<UrlMapping> getMapping(
            @PathVariable String mappingId) {

        return ResponseEntity.ok(
                mappingService.getMappingById(mappingId)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UrlMapping>> getUserMappings(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                mappingService.getUserMappings(userId)
        );
    }

    @DeleteMapping("/{mappingId}")
    public ResponseEntity<Void> deleteMapping(
            @PathVariable String mappingId) {

        mappingService.deleteMapping(mappingId);
        return ResponseEntity.noContent().build();
    }
}
