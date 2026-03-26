package com.toolsapp.backend.tool.repository;

import com.toolsapp.backend.tool.entity.ToolCatalog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ToolCatalogRepository extends JpaRepository<ToolCatalog, Long> {

    List<ToolCatalog> findAllByEnabledOrderBySortOrderAsc(Integer enabled);

    Optional<ToolCatalog> findByToolCode(String toolCode);
}
