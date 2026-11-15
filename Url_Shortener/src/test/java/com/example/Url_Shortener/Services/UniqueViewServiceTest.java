package com.example.Url_Shortener.Services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.data.redis.core.HyperLogLogOperations;
import org.springframework.data.redis.core.StringRedisTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UniqueViewServiceTest {

    private StringRedisTemplate redisTemplate;
    private HyperLogLogOperations<String, String> hyperLogLog;
    private UniqueViewService uniqueViewService;

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() {
        redisTemplate = mock(StringRedisTemplate.class);
        hyperLogLog = mock(HyperLogLogOperations.class);
        when(redisTemplate.opsForHyperLogLog()).thenReturn(hyperLogLog);
        uniqueViewService = new UniqueViewService(redisTemplate);
    }

    @Test
    void addsCookieIdentifierToCanonicalLinkKey() {
        uniqueViewService.record(42L, "visitor-id");

        verify(hyperLogLog).add("analytics:unique:link:42", "visitor-id");
    }

    @Test
    void repeatedClicksSendTheSameIdentifierToHyperLogLog() {
        uniqueViewService.record(42L, "same-visitor");
        uniqueViewService.record(42L, "same-visitor");

        verify(hyperLogLog, times(2)).add("analytics:unique:link:42", "same-visitor");
    }

    @Test
    void differentVisitorsAndLinksUseIndependentHyperLogLogs() {
        uniqueViewService.record(42L, "visitor-one");
        uniqueViewService.record(42L, "visitor-two");
        uniqueViewService.record(43L, "visitor-one");

        verify(hyperLogLog).add("analytics:unique:link:42", "visitor-one");
        verify(hyperLogLog).add("analytics:unique:link:42", "visitor-two");
        verify(hyperLogLog).add("analytics:unique:link:43", "visitor-one");
    }

    @Test
    void missingKeyReturnsZero() {
        when(hyperLogLog.size("analytics:unique:link:42")).thenReturn(0L);

        assertEquals(0, uniqueViewService.count(42L));
    }

    @Test
    void countReturnsRedisEstimateWithoutConvertingItToAnExactClickCount() {
        when(hyperLogLog.size("analytics:unique:link:42")).thenReturn(23L);

        assertEquals(23, uniqueViewService.count(42L));
    }

    @Test
    void redisWriteFailureDoesNotFailTheRedirectingCaller() {
        when(hyperLogLog.add("analytics:unique:link:42", "visitor-id"))
                .thenThrow(new DataAccessResourceFailureException("unavailable"));

        assertDoesNotThrow(() -> uniqueViewService.record(42L, "visitor-id"));
    }

    @Test
    void redisReadFailureIsPropagatedInsteadOfReportedAsZero() {
        when(hyperLogLog.size("analytics:unique:link:42"))
                .thenThrow(new DataAccessResourceFailureException("unavailable"));

        assertThrows(DataAccessResourceFailureException.class,
                () -> uniqueViewService.count(42L));
    }
}
