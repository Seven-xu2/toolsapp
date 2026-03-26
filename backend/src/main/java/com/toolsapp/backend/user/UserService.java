package com.toolsapp.backend.user;

import com.toolsapp.backend.favorite.repository.UserFavoriteRepository;
import com.toolsapp.backend.history.repository.UserHistoryRepository;
import com.toolsapp.backend.security.CurrentUser;
import com.toolsapp.backend.user.dto.UpdateProfileRequest;
import com.toolsapp.backend.user.dto.UserProfileVO;
import com.toolsapp.backend.user.dto.UserStatsVO;
import com.toolsapp.backend.user.entity.SysUser;
import com.toolsapp.backend.user.repository.SysUserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final SysUserRepository sysUserRepository;
    private final UserFavoriteRepository userFavoriteRepository;
    private final UserHistoryRepository userHistoryRepository;

    public UserService(SysUserRepository sysUserRepository,
                       UserFavoriteRepository userFavoriteRepository,
                       UserHistoryRepository userHistoryRepository) {
        this.sysUserRepository = sysUserRepository;
        this.userFavoriteRepository = userFavoriteRepository;
        this.userHistoryRepository = userHistoryRepository;
    }

    public UserProfileVO getProfile() {
        SysUser user = CurrentUser.require();
        return new UserProfileVO(user.getId(), user.getPhone(), user.getNickname(), user.getAvatarUrl());
    }

    public UserProfileVO updateProfile(UpdateProfileRequest request) {
        SysUser user = CurrentUser.require();
        user.setNickname(request.getNickname());
        user.setUpdatedAt(LocalDateTime.now());
        SysUser saved = sysUserRepository.save(user);
        return new UserProfileVO(saved.getId(), saved.getPhone(), saved.getNickname(), saved.getAvatarUrl());
    }

    public UserStatsVO getStats() {
        SysUser user = CurrentUser.require();
        return new UserStatsVO(
                userFavoriteRepository.countByUserId(user.getId()),
                userHistoryRepository.countByUserId(user.getId())
        );
    }
}
