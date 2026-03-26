package com.toolsapp.backend.auth;

import com.toolsapp.backend.auth.dto.LoginRequest;
import com.toolsapp.backend.auth.dto.LoginResponse;
import com.toolsapp.backend.auth.dto.RegisterRequest;
import com.toolsapp.backend.common.BizException;
import com.toolsapp.backend.security.JwtService;
import com.toolsapp.backend.user.entity.SysUser;
import com.toolsapp.backend.user.repository.SysUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final SysUserRepository sysUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(SysUserRepository sysUserRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.sysUserRepository = sysUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public void register(RegisterRequest request) {
        if (sysUserRepository.existsByPhone(request.getPhone())) {
            throw new BizException("该手机号已注册");
        }
        LocalDateTime now = LocalDateTime.now();
        SysUser user = new SysUser();
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setNickname(request.getNickname());
        user.setAvatarUrl(null);
        user.setStatus(1);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        sysUserRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        SysUser user = sysUserRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new BizException("账号或密码错误"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BizException("账号或密码错误");
        }
        String token = jwtService.generateToken(user.getId(), user.getPhone());
        return new LoginResponse(
                token,
                "Bearer",
                jwtService.getExpirationSeconds(),
                new LoginResponse.LoginUserVO(user.getId(), user.getPhone(), user.getNickname())
        );
    }
}
