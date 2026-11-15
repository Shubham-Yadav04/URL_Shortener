package com.example.Url_Shortener.Services;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;
import java.util.regex.Pattern;

@Service
public class VisitorCookieService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final Pattern VISITOR_ID_PATTERN = Pattern.compile("[A-Za-z0-9_-]{43}");

    private final String cookieName;
    private final long maxAgeSeconds;
    private final boolean secure;
    private final String sameSite;
    private final String path;

    public VisitorCookieService(
            @Value("${app.visitor-cookie.name:visitor_id}") String cookieName,
            @Value("${app.visitor-cookie.max-age-seconds:31536000}") long maxAgeSeconds,
            @Value("${app.visitor-cookie.secure:${app.cookie.secure:false}}") boolean secure,
            @Value("${app.visitor-cookie.same-site:${app.cookie.same-site:Lax}}") String sameSite,
            @Value("${app.visitor-cookie.path:/}") String path) {
        if (maxAgeSeconds <= 0) {
            throw new IllegalArgumentException("Visitor cookie lifetime must be positive");
        }
        if (!"Strict".equalsIgnoreCase(sameSite)
                && !"Lax".equalsIgnoreCase(sameSite)
                && !"None".equalsIgnoreCase(sameSite)) {
            throw new IllegalArgumentException("Visitor cookie SameSite must be Strict, Lax, or None");
        }
        if ("None".equalsIgnoreCase(sameSite) && !secure) {
            throw new IllegalArgumentException("SameSite=None visitor cookies require Secure");
        }
        if (path == null || !path.startsWith("/") || path.contains(";")) {
            throw new IllegalArgumentException("Visitor cookie path must be an absolute path");
        }
        this.cookieName = cookieName;
        this.maxAgeSeconds = maxAgeSeconds;
        this.secure = secure;
        this.sameSite = normalizeSameSite(sameSite);
        this.path = path;
    }

    public String resolveVisitorId(HttpServletRequest request, HttpServletResponse response) {
        String visitorId = findValidVisitorId(request.getCookies());
        if (visitorId == null) {
            visitorId = generateVisitorId();
        }

        ResponseCookie cookie = ResponseCookie.from(cookieName, visitorId)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path(path)
                .maxAge(Duration.ofSeconds(maxAgeSeconds))
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        return visitorId;
    }

    private String findValidVisitorId(Cookie[] cookies) {
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (cookieName.equals(cookie.getName()) && isValidVisitorId(cookie.getValue())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private boolean isValidVisitorId(String value) {
        if (value == null || !VISITOR_ID_PATTERN.matcher(value).matches()) {
            return false;
        }
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(value);
            return decoded.length == 32
                    && Base64.getUrlEncoder().withoutPadding().encodeToString(decoded).equals(value);
        } catch (IllegalArgumentException exception) {
            return false;
        }
    }

    private String generateVisitorId() {
        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private String normalizeSameSite(String value) {
        if ("strict".equalsIgnoreCase(value)) {
            return "Strict";
        }
        if ("none".equalsIgnoreCase(value)) {
            return "None";
        }
        return "Lax";
    }
}
