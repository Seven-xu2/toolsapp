package com.toolsapp.backend.history.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HistoryItemVO {

    private Long id;
    private String toolCode;
    private String toolName;
    private String summary;
    private String createdAt;
}
