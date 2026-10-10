package com.nightdrop.service;

import com.nightdrop.dto.AddressDto;
import com.nightdrop.dto.AddressRequest;
import com.nightdrop.entity.Address;
import com.nightdrop.entity.User;
import com.nightdrop.exception.ResourceNotFoundException;
import com.nightdrop.repository.AddressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Transactional(readOnly = true)
    public List<AddressDto> getUserAddresses(User user) {
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressDto createAddress(AddressRequest request, User user) {
        List<Address> existingAddresses = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId());
        boolean shouldBeDefault = Boolean.TRUE.equals(request.getIsDefault()) || existingAddresses.isEmpty();

        if (shouldBeDefault && !existingAddresses.isEmpty()) {
            for (Address addr : existingAddresses) {
                if (Boolean.TRUE.equals(addr.getIsDefault())) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            }
        }

        Address address = Address.builder()
                .user(user)
                .recipientName(request.getRecipientName().trim())
                .phone(request.getPhone().trim())
                .streetAddress(request.getStreetAddress().trim())
                .city(request.getCity().trim())
                .state(request.getState().trim())
                .postalCode(request.getPostalCode().trim())
                .landmark(request.getLandmark() != null ? request.getLandmark().trim() : null)
                .isDefault(shouldBeDefault)
                .build();

        Address saved = addressRepository.save(address);
        return mapToDto(saved);
    }

    @Transactional
    public AddressDto updateAddress(Long id, AddressRequest request, User user) {
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or does not belong to you"));

        if (Boolean.TRUE.equals(request.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            List<Address> userAddresses = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId());
            for (Address addr : userAddresses) {
                if (!addr.getId().equals(id) && Boolean.TRUE.equals(addr.getIsDefault())) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            }
        }

        address.setRecipientName(request.getRecipientName().trim());
        address.setPhone(request.getPhone().trim());
        address.setStreetAddress(request.getStreetAddress().trim());
        address.setCity(request.getCity().trim());
        address.setState(request.getState().trim());
        address.setPostalCode(request.getPostalCode().trim());
        address.setLandmark(request.getLandmark() != null ? request.getLandmark().trim() : null);
        if (request.getIsDefault() != null) {
            address.setIsDefault(request.getIsDefault());
        }

        Address updated = addressRepository.save(address);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteAddress(Long id, User user) {
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or does not belong to you"));
        addressRepository.delete(address);
    }

    @Transactional
    public AddressDto setDefaultAddress(Long id, User user) {
        Address targetAddress = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or does not belong to you"));

        List<Address> userAddresses = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId());
        for (Address addr : userAddresses) {
            addr.setIsDefault(addr.getId().equals(id));
            addressRepository.save(addr);
        }

        return mapToDto(targetAddress);
    }

    public AddressDto mapToDto(Address address) {
        return AddressDto.builder()
                .id(address.getId())
                .recipientName(address.getRecipientName())
                .phone(address.getPhone())
                .streetAddress(address.getStreetAddress())
                .city(address.getCity())
                .state(address.getState())
                .postalCode(address.getPostalCode())
                .landmark(address.getLandmark())
                .isDefault(address.getIsDefault())
                .createdAt(address.getCreatedAt())
                .build();
    }
}
