package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.Services.UrlSecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UrlSecurityController {

    private final UrlSecurityService securityService;

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

    @PostMapping("/{id}/verify")
    public ResponseEntity<?> verify(
            @PathVariable Long id,
            @RequestBody String password) {

        boolean valid = securityService.verifyPassword(id, password);

        return ResponseEntity.ok(Map.of("valid", valid));
    }
}
