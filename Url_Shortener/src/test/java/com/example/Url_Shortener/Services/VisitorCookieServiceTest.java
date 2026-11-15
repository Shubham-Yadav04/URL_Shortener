package com.example.Url_Shortener.Services;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.*;

class VisitorCookieServiceTest {

    private final VisitorCookieService cookieService =
            new VisitorCookieService("visitor_id", 86400, true, "Lax", "/");

    @Test
    void firstVisitCreatesOpaqueIdAndSetsPersistentHttpOnlyCookie() {
        MockHttpServletResponse response = new MockHttpServletResponse();
        String visitorId = cookieService.resolveVisitorId(new MockHttpServletRequest(), response);

        assertTrue(visitorId.matches("[A-Za-z0-9_-]{43}"));
        String setCookie = response.getHeader("Set-Cookie");
        assertNotNull(setCookie);
        assertTrue(setCookie.contains("visitor_id=" + visitorId));
        assertTrue(setCookie.contains("Path=/"));
        assertTrue(setCookie.contains("Max-Age=86400"));
        assertTrue(setCookie.contains("HttpOnly"));
        assertTrue(setCookie.contains("Secure"));
        assertTrue(setCookie.contains("SameSite=Lax"));
    }

    @Test
    void validCookieReusesVisitorIdAndRenewsExpiration() {
        String existingId = cookieService.resolveVisitorId(
                new MockHttpServletRequest(), new MockHttpServletResponse());
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("visitor_id", existingId));
        MockHttpServletResponse response = new MockHttpServletResponse();

        assertEquals(existingId, cookieService.resolveVisitorId(request, response));
        assertTrue(response.getHeader("Set-Cookie").contains("Max-Age=86400"));
    }

    @Test
    void missingOrInvalidCookieGeneratesANewVisitorId() {
        String firstId = cookieService.resolveVisitorId(
                new MockHttpServletRequest(), new MockHttpServletResponse());
        MockHttpServletRequest invalidCookieRequest = new MockHttpServletRequest();
        invalidCookieRequest.setCookies(new Cookie("visitor_id", "not-a-valid-id"));

        String secondId = cookieService.resolveVisitorId(
                invalidCookieRequest, new MockHttpServletResponse());

        assertNotEquals(firstId, secondId);
        assertTrue(secondId.matches("[A-Za-z0-9_-]{43}"));
    }
}
