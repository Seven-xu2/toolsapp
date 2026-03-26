package com.toolsapp.backend.favorite.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FavoriteItemVO {

    private Long id;
    private String toolCode;
    private String toolName;
    private String icon;
    private String color;
    private String description;
    private String createdAt;
}
