package com.nightdrop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalTime;

public class StoreRequest {
    @NotBlank(message = "Store name is required")
    @Size(min = 2, max = 120, message = "Store name must be between 2 and 120 characters")
    private String name;

    private String description;

    @NotBlank(message = "Address is required")
    private String address;

    private String phone;
    private String imageUrl;

    @NotNull(message = "Opening time is required")
    private LocalTime openingTime;

    @NotNull(message = "Closing time is required")
    private LocalTime closingTime;

    private Boolean isActive;

    @NotNull(message = "Delivery fee is required")
    private BigDecimal deliveryFee;

    public StoreRequest() {}

    public StoreRequest(String name, String description, String address, String phone, String imageUrl,
                        LocalTime openingTime, LocalTime closingTime, Boolean isActive, BigDecimal deliveryFee) {
        this.name = name;
        this.description = description;
        this.address = address;
        this.phone = phone;
        this.imageUrl = imageUrl;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.isActive = isActive;
        this.deliveryFee = deliveryFee;
    }

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

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String name;
        private String description;
        private String address;
        private String phone;
        private String imageUrl;
        private LocalTime openingTime;
        private LocalTime closingTime;
        private Boolean isActive;
        private BigDecimal deliveryFee;

        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder openingTime(LocalTime openingTime) { this.openingTime = openingTime; return this; }
        public Builder closingTime(LocalTime closingTime) { this.closingTime = closingTime; return this; }
        public Builder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public Builder deliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; return this; }

        public StoreRequest build() {
            return new StoreRequest(name, description, address, phone, imageUrl, openingTime, closingTime, isActive, deliveryFee);
        }
    }
}
