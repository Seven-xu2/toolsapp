package com.toolsapp.backend.tool;

import com.toolsapp.backend.common.ApiResponse;
import com.toolsapp.backend.tool.dto.ToolVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/tools")
public class ToolController {

    private final ToolService toolService;

    public ToolController(ToolService toolService) {
        this.toolService = toolService;
    }

    @GetMapping
    public ApiResponse<List<ToolVO>> list() {
        return ApiResponse.success(toolService.list());
    }

    @GetMapping("/favorites")
    public ApiResponse<Set<String>> favoriteCodes() {
        return ApiResponse.success(toolService.favoriteCodes());
    }
}
