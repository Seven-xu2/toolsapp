package com.toolsapp.backend.history;

import com.toolsapp.backend.common.ApiResponse;
import com.toolsapp.backend.common.PageResult;
import com.toolsapp.backend.history.dto.HistoryCreateRequest;
import com.toolsapp.backend.history.dto.HistoryItemVO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/histories")
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public ApiResponse<PageResult<HistoryItemVO>> page(@RequestParam(defaultValue = "1") int pageNum,
                                                       @RequestParam(defaultValue = "20") int pageSize) {
        return ApiResponse.success(historyService.page(pageNum, pageSize));
    }

    @PostMapping
    public ApiResponse<Void> create(@Valid @RequestBody HistoryCreateRequest request) {
        historyService.create(request);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteOne(@PathVariable Long id) {
        historyService.deleteOne(id);
        return ApiResponse.success(null);
    }

    @DeleteMapping
    public ApiResponse<Void> clear() {
        historyService.clear();
        return ApiResponse.success(null);
    }
}
