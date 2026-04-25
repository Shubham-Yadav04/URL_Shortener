package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.DTO.CreateRequestDTO;
import com.example.Url_Shortener.DTO.UrlMappingDTO;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.RedirectionException;
import com.example.Url_Shortener.Modal.UrlMapping;
import com.example.Url_Shortener.Services.MappingService;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

@RestController
@RequestMapping("mapping")
public class MappingController {


    private final MappingService mappingService;

    public MappingController(MappingService mappingService) {
        this.mappingService = mappingService;
    }

    @GetMapping("/health-check")
    public String healthCheck(){
        return "mapping working";
    }
    @PostMapping("/shorten/{userId}")
    public ResponseEntity<UrlMappingDTO> createShortUrl(
            @PathVariable String userId,
           @RequestBody  CreateRequestDTO requestDTO
    ) throws MalformedURLException {
        System.out.println("creating the mapping "+ requestDTO.toString());
        try{
            UrlMappingDTO res=mappingService.createShortUrl(userId,requestDTO);
            return ResponseEntity.ok(
res
            );
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }


    @GetMapping("/{mappingId}")
    public ResponseEntity<UrlMappingDTO> getMapping(
            @PathVariable Long mappingId) {

        return ResponseEntity.ok(
                mappingService.getMappingById(mappingId)
        );
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UrlMappingDTO>> getUserMappings(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                mappingService.getUserMappings(userId)
        );
    }
@PutMapping("/{shortCode}")

public ResponseEntity<String> updatingLongUrl(@PathVariable("shortCode" ) String shortCode, @RequestParam("longUrl") String longUrl){
       try{
           return  ResponseEntity.ok( mappingService.updateLongUrl(shortCode,longUrl));
       } catch (Exception e) {
           throw new RuntimeException(e.getMessage());
       }
}
    @DeleteMapping("/{mappingId}")
    public ResponseEntity<Void> deleteMapping(
            @PathVariable Long mappingId) {

        mappingService.deleteMapping(mappingId);
        return ResponseEntity.noContent().build();
    }
}
