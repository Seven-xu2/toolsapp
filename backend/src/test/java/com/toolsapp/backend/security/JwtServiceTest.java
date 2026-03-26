package com.toolsapp.backend.security;

import com.toolsapp.backend.config.JwtProperties;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    @Test
    void shouldGenerateAndParseToken() {
        JwtProperties properties = new JwtProperties();
        properties.setSecret("unit-test-secret-unit-test-secret-123456");
        properties.setExpirationSeconds(3600);
        JwtService jwtService = new JwtService(properties);
        String token = jwtService.generateToken(9L, "13800138000");

        var claims = jwtService.parse(token);
        Assertions.assertEquals("9", claims.getSubject());
        Assertions.assertEquals("13800138000", claims.get("phone", String.class));
    }
}
