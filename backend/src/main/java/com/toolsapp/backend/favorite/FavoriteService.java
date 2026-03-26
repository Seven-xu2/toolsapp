package com.toolsapp.backend.favorite;

import com.toolsapp.backend.common.BizException;
import com.toolsapp.backend.favorite.dto.FavoriteCreateRequest;
import com.toolsapp.backend.favorite.dto.FavoriteItemVO;
import com.toolsapp.backend.favorite.entity.UserFavorite;
import com.toolsapp.backend.favorite.repository.UserFavoriteRepository;
import com.toolsapp.backend.security.CurrentUser;
import com.toolsapp.backend.tool.entity.ToolCatalog;
import com.toolsapp.backend.tool.repository.ToolCatalogRepository;
import com.toolsapp.backend.user.entity.SysUser;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class FavoriteService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final UserFavoriteRepository userFavoriteRepository;
    private final ToolCatalogRepository toolCatalogRepository;

    public FavoriteService(UserFavoriteRepository userFavoriteRepository, ToolCatalogRepository toolCatalogRepository) {
        this.userFavoriteRepository = userFavoriteRepository;
        this.toolCatalogRepository = toolCatalogRepository;
    }

    public List<FavoriteItemVO> list() {
        SysUser user = CurrentUser.require();
        return userFavoriteRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(item -> {
                    ToolCatalog tool = toolCatalogRepository.findByToolCode(item.getToolCode())
                            .orElseThrow(() -> new BizException("工具不存在"));
                    return new FavoriteItemVO(
                            item.getId(),
                            item.getToolCode(),
                            tool.getToolName(),
                            tool.getIcon(),
                            tool.getColor(),
                            tool.getDescription(),
                            item.getCreatedAt().format(FORMATTER)
                    );
                })
                .toList();
    }

    @Transactional
    public void add(FavoriteCreateRequest request) {
        SysUser user = CurrentUser.require();
        toolCatalogRepository.findByToolCode(request.getToolCode()).orElseThrow(() -> new BizException("工具不存在"));
        if (userFavoriteRepository.findByUserIdAndToolCode(user.getId(), request.getToolCode()).isPresent()) {
            return;
        }
        UserFavorite favorite = new UserFavorite();
        favorite.setUserId(user.getId());
        favorite.setToolCode(request.getToolCode());
        favorite.setCreatedAt(LocalDateTime.now());
        userFavoriteRepository.save(favorite);
    }

    @Transactional
    public void remove(String toolCode) {
        SysUser user = CurrentUser.require();
        userFavoriteRepository.deleteByUserIdAndToolCode(user.getId(), toolCode);
    }
}