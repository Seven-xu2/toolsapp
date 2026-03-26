package com.toolsapp.backend.history.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HistoryCreateRequest {

    @NotBlank(message = "工具编码不能为空")
    private String toolCode;

    @NotBlank(message = "工具名称不能为空")
    @Size(max = 50, message = "工具名称长度不能超过50")
    private String toolName;

    @NotBlank(message = "摘要不能为空")
    @Size(max = 255, message = "摘要长度不能超过255")
    private String summary;
}
