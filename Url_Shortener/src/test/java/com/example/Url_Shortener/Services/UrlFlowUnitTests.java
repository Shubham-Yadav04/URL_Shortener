package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.DTO.RedisMappingDTO;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.InValidShortCode;
import com.example.Url_Shortener.Modal.UrlMapping;
import com.example.Url_Shortener.Modal.User;
import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;

class UrlFlowUnitTests {

    private final MappingService mappingService = new MappingService(
            null, null, null, null, null, null, null, null);

    @Test
    void customShortCodesAreValidatedAndNormalized() {
        assertEquals("my-code_2", MappingService.normalizeCustomCode(" my-code_2 "));
        assertThrows(InValidShortCode.class, () -> MappingService.normalizeCustomCode("ab"));
        assertThrows(InValidShortCode.class, () -> MappingService.normalizeCustomCode("bad/code"));
    }

    @Test
    void mappingOwnershipRejectsAnotherAccount() {
        User owner = new User();
        owner.setUserId("owner-1");
        UrlMapping mapping = UrlMapping.builder().owner(owner).build();

        assertDoesNotThrow(() -> mappingService.requireOwner(mapping, "owner-1"));
        assertThrows(AccessDeniedException.class,
                () -> mappingService.requireOwner(mapping, "owner-2"));
    }

    @Test
    void expiredOrDeactivatedCachedLinksCannotRedirect() {
        RedisMappingDTO active = RedisMappingDTO.builder().active(true).build();
        assertTrue(mappingService.isAvailableForRedirect(active));

        RedisMappingDTO deactivated = RedisMappingDTO.builder().active(false).build();
        assertFalse(mappingService.isAvailableForRedirect(deactivated));

        RedisMappingDTO expired = RedisMappingDTO.builder()
                .active(true)
                .expiresAtEpochMillis(System.currentTimeMillis() - 1)
                .build();
        assertFalse(mappingService.isAvailableForRedirect(expired));
    }

    @Test
    void jwtUsesConfiguredSecretAndEnforcesExpiry() throws Exception {
        JwtService jwtService = new JwtService();
        Field secret = JwtService.class.getDeclaredField("secret");
        secret.setAccessible(true);
        secret.set(jwtService, "unit-test-secret-with-more-than-32-bytes");

        String accessToken = jwtService.generateToken("person@example.com", 60_000);
        assertEquals("person@example.com", jwtService.extractEmail(accessToken));
        assertTrue(jwtService.isValidToken(accessToken, "person@example.com"));

        String expiredToken = jwtService.generateToken("person@example.com", -1);
        assertThrows(ExpiredJwtException.class, () -> jwtService.extractEmail(expiredToken));
    }
}
