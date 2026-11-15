package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.DTO.RedisMappingDTO;
import com.example.Url_Shortener.Services.MappingService;
import com.example.Url_Shortener.Services.RedirectProducer;
import com.example.Url_Shortener.Services.RequestService;
import com.example.Url_Shortener.Services.UniqueViewService;
import com.example.Url_Shortener.Services.VisitorCookieService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.data.redis.core.HyperLogLogOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class RedirectionControllerTest {

    private static final String DESTINATION = "https://example.com/landing";

    private MappingService mappingService;
    private HyperLogLogOperations<String, String> hyperLogLog;
    private MockMvc mockMvc;

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() {
        mappingService = mock(MappingService.class);
        RequestService requestService = mock(RequestService.class);
        when(requestService.resolveCountry(any())).thenReturn("Unknown");
        when(requestService.resolveDeviceType(any())).thenReturn("Unknown");

        StringRedisTemplate redisTemplate = mock(StringRedisTemplate.class);
        hyperLogLog = mock(HyperLogLogOperations.class);
        when(redisTemplate.opsForHyperLogLog()).thenReturn(hyperLogLog);
        UniqueViewService uniqueViewService = new UniqueViewService(redisTemplate);
        VisitorCookieService visitorCookieService =
                new VisitorCookieService("visitor_id", 86400, true, "Lax", "/");

        RedisMappingDTO details = RedisMappingDTO.builder()
                .mappingId(73L)
                .longUrl(DESTINATION)
                .active(true)
                .build();
        when(mappingService.getRedirectDetails("short-code")).thenReturn(details);
        when(mappingService.isAvailableForRedirect(details)).thenReturn(true);

        RedirectionController controller = new RedirectionController(
                mappingService,
                mock(RedirectProducer.class),
                requestService,
                uniqueViewService,
                visitorCookieService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void redirectsAndReusesCookieIdentityThenCountsNewIdentityAfterCookieRemoval() throws Exception {
        String firstCookie = mockMvc.perform(get("/r/short-code"))
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(DESTINATION))
                .andExpect(header().string("Set-Cookie",
                        org.hamcrest.Matchers.containsString("HttpOnly")))
                .andReturn()
                .getResponse()
                .getHeader("Set-Cookie");
        String firstVisitorId = cookieValue(firstCookie);

        mockMvc.perform(get("/r/short-code")
                        .cookie(new Cookie("visitor_id", firstVisitorId)))
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(DESTINATION));

        String secondCookie = mockMvc.perform(get("/r/short-code"))
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(DESTINATION))
                .andReturn()
                .getResponse()
                .getHeader("Set-Cookie");
        String secondVisitorId = cookieValue(secondCookie);

        assertNotEquals(firstVisitorId, secondVisitorId);
        verify(hyperLogLog).add("analytics:unique:link:73", secondVisitorId);
        verify(hyperLogLog, times(2)).add("analytics:unique:link:73", firstVisitorId);
        verify(mappingService, times(3)).getRedirectDetails("short-code");
    }

    @Test
    void redisWriteFailureDoesNotChangeRedirectDestinationOrStatus() throws Exception {
        when(hyperLogLog.add(eq("analytics:unique:link:73"), anyString()))
                .thenThrow(new DataAccessResourceFailureException("unavailable"));

        mockMvc.perform(get("/r/short-code"))
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(DESTINATION))
                .andExpect(header().string("Set-Cookie",
                        org.hamcrest.Matchers.containsString("visitor_id=")));
    }

    private String cookieValue(String setCookieHeader) {
        assertNotNull(setCookieHeader);
        return setCookieHeader.substring("visitor_id=".length(), setCookieHeader.indexOf(';'));
    }
}
