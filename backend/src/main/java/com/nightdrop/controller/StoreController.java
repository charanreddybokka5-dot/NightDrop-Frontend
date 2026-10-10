package com.nightdrop.controller;

import com.nightdrop.dto.StoreDto;
import com.nightdrop.dto.StoreRequest;
import com.nightdrop.entity.User;
import com.nightdrop.exception.ResourceNotFoundException;
import com.nightdrop.repository.UserRepository;
import com.nightdrop.security.CustomUserDetails;
import com.nightdrop.service.StoreService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    private final StoreService storeService;
    private final UserRepository userRepository;

    public StoreController(StoreService storeService, UserRepository userRepository) {
        this.storeService = storeService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<StoreDto>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/open")
    public ResponseEntity<List<StoreDto>> getOpenStores() {
        return ResponseEntity.ok(storeService.getOpenStoresNow());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreDto> getStoreById(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.getStoreById(id));
    }

    @GetMapping("/owner/my")
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'ADMIN')")
    public ResponseEntity<List<StoreDto>> getOwnerStores(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(storeService.getStoresByOwner(user));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'ADMIN')")
    public ResponseEntity<StoreDto> createStore(
            @Valid @RequestBody StoreRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        StoreDto created = storeService.createStore(request, user);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'ADMIN')")
    public ResponseEntity<StoreDto> updateStore(
            @PathVariable Long id,
            @Valid @RequestBody StoreRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        StoreDto updated = storeService.updateStore(id, request, user);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'ADMIN')")
    public ResponseEntity<StoreDto> toggleStoreStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        StoreDto updated = storeService.toggleStoreStatus(id, user);
        return ResponseEntity.ok(updated);
    }

    private User getUser(CustomUserDetails userDetails) {
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
