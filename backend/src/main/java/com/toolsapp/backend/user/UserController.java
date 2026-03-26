package com.toolsapp.backend.user;

import com.toolsapp.backend.common.ApiResponse;
import com.toolsapp.backend.user.dto.UpdateProfileRequest;
import com.toolsapp.backend.user.dto.UserProfileVO;
import com.toolsapp.backend.user.dto.UserStatsVO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/me")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ApiResponse<UserProfileVO> profile() {
        return ApiResponse.success(userService.getProfile());
    }

    @PutMapping
    public ApiResponse<UserProfileVO> update(@Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.success(userService.updateProfile(request));
    }

    @GetMapping("/stats")
    public ApiResponse<UserStatsVO> stats() {
        return ApiResponse.success(userService.getStats());
    }
}
