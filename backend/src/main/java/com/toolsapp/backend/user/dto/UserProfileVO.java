package com.toolsapp.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserProfileVO {

    private Long id;
    private String phone;
    private String nickname;
    private String avatarUrl;
}
