package com.toolsapp.backend.user.repository;

import com.toolsapp.backend.user.entity.SysUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SysUserRepository extends JpaRepository<SysUser, Long> {

    boolean existsByPhone(String phone);

    Optional<SysUser> findByPhone(String phone);
}
