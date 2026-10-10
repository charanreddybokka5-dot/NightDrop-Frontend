package com.nightdrop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class StoreDto {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String phone;
    private String imageUrl;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private Boolean isActive;
    private BigDecimal deliveryFee;
    private Double rating;
    private Long ownerId;
    private String ownerName;

    private Boolean isOpen;
    private String currentServerTime;
    private String operatingStatusMessage;
    private LocalDateTime createdAt;

    public StoreDto() {}

    public StoreDto(Long id, String name, String description, String address, String phone, String imageUrl,
                    LocalTime openingTime, LocalTime closingTime, Boolean isActive, BigDecimal deliveryFee,
                    Double rating, Long ownerId, String ownerName, Boolean isOpen, String currentServerTime,
                    String operatingStatusMessage, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.address = address;
        this.phone = phone;
        this.imageUrl = imageUrl;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.isActive = isActive;
        this.deliveryFee = deliveryFee;
        this.rating = rating;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.isOpen = isOpen;
        this.currentServerTime = currentServerTime;
        this.operatingStatusMessage = operatingStatusMessage;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalTime getOpeningTime() { return openingTime; }
    public void setOpeningTime(LocalTime openingTime) { this.openingTime = openingTime; }

    public LocalTime getClosingTime() { return closingTime; }
    public void setClosingTime(LocalTime closingTime) { this.closingTime = closingTime; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public Boolean getIsOpen() { return isOpen; }
    public void setIsOpen(Boolean isOpen) { this.isOpen = isOpen; }

    public String getCurrentServerTime() { return currentServerTime; }
    public void setCurrentServerTime(String currentServerTime) { this.currentServerTime = currentServerTime; }

    public String getOperatingStatusMessage() { return operatingStatusMessage; }
    public void setOperatingStatusMessage(String operatingStatusMessage) { this.operatingStatusMessage = operatingStatusMessage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String description;
        private String address;
        private String phone;
        private String imageUrl;
        private LocalTime openingTime;
        private LocalTime closingTime;
        private Boolean isActive;
        private BigDecimal deliveryFee;
        private Double rating;
        private Long ownerId;
        private String ownerName;
        private Boolean isOpen;
        private String currentServerTime;
        private String operatingStatusMessage;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder openingTime(LocalTime openingTime) { this.openingTime = openingTime; return this; }
        public Builder closingTime(LocalTime closingTime) { this.closingTime = closingTime; return this; }
        public Builder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public Builder deliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; return this; }
        public Builder rating(Double rating) { this.rating = rating; return this; }
        public Builder ownerId(Long ownerId) { this.ownerId = ownerId; return this; }
        public Builder ownerName(String ownerName) { this.ownerName = ownerName; return this; }
        public Builder isOpen(Boolean isOpen) { this.isOpen = isOpen; return this; }
        public Builder currentServerTime(String currentServerTime) { this.currentServerTime = currentServerTime; return this; }
        public Builder operatingStatusMessage(String operatingStatusMessage) { this.operatingStatusMessage = operatingStatusMessage; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public StoreDto build() {
            return new StoreDto(id, name, description, address, phone, imageUrl, openingTime, closingTime,
                    isActive, deliveryFee, rating, ownerId, ownerName, isOpen, currentServerTime, operatingStatusMessage, createdAt);
        }
    }
}
