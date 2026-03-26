package com.toolsapp.backend.history;

import com.toolsapp.backend.history.repository.UserHistoryRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class HistoryServiceTest {

    @Test
    void shouldTrimLongSummary() {
        HistoryService historyService = new HistoryService(Mockito.mock(UserHistoryRepository.class));
        String summary = "x".repeat(300);
        Assertions.assertEquals(255, historyService.trimSummary(summary).length());
    }
}
