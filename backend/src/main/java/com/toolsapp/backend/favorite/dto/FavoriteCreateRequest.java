package com.toolsapp.backend.favorite.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FavoriteCreateRequest {

    @NotBlank(message = "工具编码不能为空")
    private String toolCode;
}
