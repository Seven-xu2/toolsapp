package com.toolsapp.backend.favorite.repository;

import com.toolsapp.backend.favorite.entity.UserFavorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {

    List<UserFavorite> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    List<UserFavorite> findAllByUserId(Long userId);

    Optional<UserFavorite> findByUserIdAndToolCode(Long userId, String toolCode);

    long countByUserId(Long userId);

    void deleteByUserIdAndToolCode(Long userId, String toolCode);
}
