package com.nightdrop.service;

import com.nightdrop.dto.StoreDto;
import com.nightdrop.dto.StoreRequest;
import com.nightdrop.entity.Role;
import com.nightdrop.entity.Store;
import com.nightdrop.entity.User;
import com.nightdrop.exception.BadRequestException;
import com.nightdrop.exception.ResourceNotFoundException;
import com.nightdrop.exception.UnauthorizedException;
import com.nightdrop.repository.StoreRepository;
import com.nightdrop.util.TimeUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StoreService {

    private final StoreRepository storeRepository;
    private final TimeUtil timeUtil;

    public StoreService(StoreRepository storeRepository, TimeUtil timeUtil) {
        this.storeRepository = storeRepository;
        this.timeUtil = timeUtil;
    }

    @Transactional(readOnly = true)
    public List<StoreDto> getAllStores() {
        return storeRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StoreDto> getActiveStores() {
        return storeRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StoreDto> getOpenStoresNow() {
        return storeRepository.findByIsActiveTrue()
                .stream()
                .filter(timeUtil::isStoreOpen)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StoreDto getStoreById(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + id));
        return mapToDto(store);
    }

    @Transactional(readOnly = true)
    public List<StoreDto> getStoresByOwner(User owner) {
        return storeRepository.findByOwnerIdOrderByIdDesc(owner.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public StoreDto createStore(StoreRequest request, User owner) {
        Store store = Store.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .address(request.getAddress().trim())
                .phone(request.getPhone())
                .imageUrl(request.getImageUrl())
                .openingTime(request.getOpeningTime())
                .closingTime(request.getClosingTime())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .deliveryFee(request.getDeliveryFee())
                .owner(owner)
                .rating(4.8)
                .build();

        Store savedStore = storeRepository.save(store);
        return mapToDto(savedStore);
    }

    @Transactional
    public StoreDto updateStore(Long id, StoreRequest request, User currentUser) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + id));

        boolean isOwner = store.getOwner().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to update this store");
        }

        store.setName(request.getName().trim());
        store.setDescription(request.getDescription());
        store.setAddress(request.getAddress().trim());
        store.setPhone(request.getPhone());
        if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            store.setImageUrl(request.getImageUrl());
        }
        store.setOpeningTime(request.getOpeningTime());
        store.setClosingTime(request.getClosingTime());
        if (request.getIsActive() != null) {
            store.setIsActive(request.getIsActive());
        }
        if (request.getDeliveryFee() != null) {
            store.setDeliveryFee(request.getDeliveryFee());
        }

        Store updatedStore = storeRepository.save(store);
        return mapToDto(updatedStore);
    }

    @Transactional
    public StoreDto toggleStoreStatus(Long id, User currentUser) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + id));

        boolean isOwner = store.getOwner().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to modify this store's status");
        }

        store.setIsActive(!Boolean.TRUE.equals(store.getIsActive()));
        Store updated = storeRepository.save(store);
        return mapToDto(updated);
    }

    public StoreDto mapToDto(Store store) {
        boolean isOpen = timeUtil.isStoreOpen(store);
        String operatingMessage = timeUtil.getOperatingStatusMessage(store);
        String serverTime = timeUtil.formatServerTime();

        return StoreDto.builder()
                .id(store.getId())
                .name(store.getName())
                .description(store.getDescription())
                .address(store.getAddress())
                .phone(store.getPhone())
                .imageUrl(store.getImageUrl())
                .openingTime(store.getOpeningTime())
                .closingTime(store.getClosingTime())
                .isActive(store.getIsActive())
                .deliveryFee(store.getDeliveryFee())
                .rating(store.getRating())
                .ownerId(store.getOwner() != null ? store.getOwner().getId() : null)
                .ownerName(store.getOwner() != null ? store.getOwner().getFullName() : null)
                .isOpen(isOpen)
                .currentServerTime(serverTime)
                .operatingStatusMessage(operatingMessage)
                .createdAt(store.getCreatedAt())
                .build();
    }
}
