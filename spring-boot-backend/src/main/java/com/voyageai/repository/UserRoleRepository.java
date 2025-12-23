package com.voyageai.repository;

import com.voyageai.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UUID> {
    
    List<UserRole> findByUserId(UUID userId);
    
    @Query("SELECT CASE WHEN COUNT(ur) > 0 THEN true ELSE false END FROM UserRole ur WHERE ur.user.id = :userId AND ur.role = :role")
    boolean hasRole(UUID userId, UserRole.AppRole role);
    
    void deleteByUserIdAndRole(UUID userId, UserRole.AppRole role);
}
