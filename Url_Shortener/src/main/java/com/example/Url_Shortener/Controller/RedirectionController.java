package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.ExceptionHandler.Exceptions.RedirectionException;
import com.example.Url_Shortener.Modal.UrlMapping;
import com.example.Url_Shortener.Services.MappingService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
@RequiredArgsConstructor
@RestController
public class RedirectionController {

    private final MappingService mappingService;

    @GetMapping("/r/{shortCode}")
    public void getMapping(
            @PathVariable String shortCode, HttpServletResponse response) throws IOException {
        UrlMapping mapping=
                mappingService.getByShortCode(shortCode);
        if(mapping.getLongUrl()!=null) {
            response.sendRedirect(mapping.getLongUrl().toString());
        }
        else throw new RedirectionException("Redirection Failed");
    }
}
