package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.DTO.AnalyticSummaryDTO;
import com.example.Url_Shortener.DTO.CustomUserDetails;
import com.example.Url_Shortener.Services.AnalyticService;
import com.example.Url_Shortener.Services.AnalyticSummaryService;
import com.example.Url_Shortener.Services.MappingService;
import com.example.Url_Shortener.Services.UniqueViewService;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AnalyticControllerTest {

    @Test
    void summaryUsesLinkOwnershipAndExposesEstimatedUniqueViews() {
        AnalyticService analyticService = mock(AnalyticService.class);
        AnalyticSummaryService summaryService = mock(AnalyticSummaryService.class);
        MappingService mappingService = mock(MappingService.class);
        UniqueViewService uniqueViewService = mock(UniqueViewService.class);
        CustomUserDetails user = mock(CustomUserDetails.class);
        when(user.getId()).thenReturn("owner-1");
        when(summaryService.getSummary(9L)).thenReturn(new AnalyticSummaryDTO(12L, null, null, null));
        when(uniqueViewService.count(9L)).thenReturn(5L);

        AnalyticController controller = new AnalyticController(
                analyticService, summaryService, mappingService, uniqueViewService);
        var response = controller.getAnalysisSummary(9L, user);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(12L, response.getBody().getTotalCount());
        assertEquals(5L, response.getBody().getUniqueViews());
        verify(mappingService).getOwnedMapping(9L, "owner-1");
    }

    @Test
    void summaryDoesNotReadAnalyticsForUnauthorizedMapping() {
        AnalyticService analyticService = mock(AnalyticService.class);
        AnalyticSummaryService summaryService = mock(AnalyticSummaryService.class);
        MappingService mappingService = mock(MappingService.class);
        UniqueViewService uniqueViewService = mock(UniqueViewService.class);
        CustomUserDetails user = mock(CustomUserDetails.class);
        when(user.getId()).thenReturn("other-user");
        when(mappingService.getOwnedMapping(9L, "other-user"))
                .thenThrow(new AccessDeniedException("Not owner"));

        AnalyticController controller = new AnalyticController(
                analyticService, summaryService, mappingService, uniqueViewService);

        assertThrows(AccessDeniedException.class,
                () -> controller.getAnalysisSummary(9L, user));
        verifyNoInteractions(summaryService, uniqueViewService);
    }
}
