package com.nightdrop.repository;

import com.nightdrop.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    List<Store> findByIsActiveTrue();
    Optional<Store> findByOwnerId(Long ownerId);
    List<Store> findByOwnerIdOrderByIdDesc(Long ownerId);
    long countByIsActiveTrue();
    List<Store> findAllByOrderByCreatedAtDesc();
}
