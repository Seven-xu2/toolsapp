package com.toolsapp.backend.tool;

import com.toolsapp.backend.favorite.repository.UserFavoriteRepository;
import com.toolsapp.backend.security.CurrentUser;
import com.toolsapp.backend.tool.dto.ToolVO;
import com.toolsapp.backend.tool.repository.ToolCatalogRepository;
import com.toolsapp.backend.user.entity.SysUser;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ToolService {

    private final ToolCatalogRepository toolCatalogRepository;
    private final UserFavoriteRepository userFavoriteRepository;

    public ToolService(ToolCatalogRepository toolCatalogRepository, UserFavoriteRepository userFavoriteRepository) {
        this.toolCatalogRepository = toolCatalogRepository;
        this.userFavoriteRepository = userFavoriteRepository;
    }

    public List<ToolVO> list() {
        return toolCatalogRepository.findAllByEnabledOrderBySortOrderAsc(1)
                .stream()
                .map(item -> new ToolVO(
                        item.getToolCode(),
                        item.getToolName(),
                        item.getIcon(),
                        item.getColor(),
                        item.getDescription(),
                        item.getEnabled()
                ))
                .toList();
    }

    public Set<String> favoriteCodes() {
        SysUser user = CurrentUser.require();
        return userFavoriteRepository.findAllByUserId(user.getId())
                .stream()
                .map(favorite -> favorite.getToolCode())
                .collect(Collectors.toSet());
    }
}
