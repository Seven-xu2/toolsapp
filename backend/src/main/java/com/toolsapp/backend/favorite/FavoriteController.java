package com.toolsapp.backend.favorite;

import com.toolsapp.backend.common.ApiResponse;
import com.toolsapp.backend.favorite.dto.FavoriteCreateRequest;
import com.toolsapp.backend.favorite.dto.FavoriteItemVO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ApiResponse<List<FavoriteItemVO>> list() {
        return ApiResponse.success(favoriteService.list());
    }

    @PostMapping
    public ApiResponse<Void> add(@Valid @RequestBody FavoriteCreateRequest request) {
        favoriteService.add(request);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{toolCode}")
    public ApiResponse<Void> remove(@PathVariable String toolCode) {
        favoriteService.remove(toolCode);
        return ApiResponse.success(null);
    }
}
