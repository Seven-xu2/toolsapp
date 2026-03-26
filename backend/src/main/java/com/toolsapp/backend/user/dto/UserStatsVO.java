package com.toolsapp.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStatsVO {

    private long favoriteCount;
    private long historyCount;
}
