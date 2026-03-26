package com.toolsapp.backend.security;

import com.toolsapp.backend.common.BizException;
import com.toolsapp.backend.user.entity.SysUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class CurrentUser {

    private CurrentUser() {
    }

    public static SysUser require() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof SysUser user)) {
            throw new BizException(401, "未登录");
        }
        return user;
    }
}
