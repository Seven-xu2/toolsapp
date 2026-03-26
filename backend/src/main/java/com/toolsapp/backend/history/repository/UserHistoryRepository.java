package com.toolsapp.backend.history.repository;

import com.toolsapp.backend.history.entity.UserHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserHistoryRepository extends JpaRepository<UserHistory, Long> {

    Page<UserHistory> findAllByUserId(Long userId, Pageable pageable);

    long countByUserId(Long userId);

    void deleteAllByUserId(Long userId);
}
