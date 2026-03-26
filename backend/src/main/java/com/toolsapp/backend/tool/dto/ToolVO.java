package com.toolsapp.backend.tool.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ToolVO {

    private String code;
    private String name;
    private String icon;
    private String color;
    private String description;
    private Integer enabled;
}
