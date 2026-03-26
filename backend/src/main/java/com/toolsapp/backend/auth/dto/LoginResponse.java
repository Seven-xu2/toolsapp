package com.toolsapp.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String tokenType;
    private long expiresIn;
    private LoginUserVO user;

    @Data
    @AllArgsConstructor
    public static class LoginUserVO {
        private Long id;
        private String phone;
        private String nickname;
    }
}
