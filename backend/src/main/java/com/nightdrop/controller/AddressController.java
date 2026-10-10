package com.nightdrop.controller;

import com.nightdrop.dto.AddressDto;
import com.nightdrop.dto.AddressRequest;
import com.nightdrop.entity.User;
import com.nightdrop.exception.ResourceNotFoundException;
import com.nightdrop.repository.UserRepository;
import com.nightdrop.security.CustomUserDetails;
import com.nightdrop.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;
    private final UserRepository userRepository;

    public AddressController(AddressService addressService, UserRepository userRepository) {
        this.addressService = addressService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<AddressDto>> getAddresses(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(addressService.getUserAddresses(user));
    }

    @PostMapping
    public ResponseEntity<AddressDto> createAddress(
            @Valid @RequestBody AddressRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        AddressDto created = addressService.createAddress(request, user);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressDto> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        AddressDto updated = addressService.updateAddress(id, request, user);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        addressService.deleteAddress(id, user);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/default")
    public ResponseEntity<AddressDto> setDefaultAddress(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        AddressDto updated = addressService.setDefaultAddress(id, user);
        return ResponseEntity.ok(updated);
    }

    private User getUser(CustomUserDetails userDetails) {
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
