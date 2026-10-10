package com.nightdrop.dto;

import java.time.LocalDateTime;

public class AddressDto {
    private Long id;
    private String recipientName;
    private String phone;
    private String streetAddress;
    private String city;
    private String state;
    private String postalCode;
    private String landmark;
    private Boolean isDefault;
    private LocalDateTime createdAt;

    public AddressDto() {}

    public AddressDto(Long id, String recipientName, String phone, String streetAddress, String city,
                      String state, String postalCode, String landmark, Boolean isDefault, LocalDateTime createdAt) {
        this.id = id;
        this.recipientName = recipientName;
        this.phone = phone;
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.landmark = landmark;
        this.isDefault = isDefault;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStreetAddress() { return streetAddress; }
    public void setStreetAddress(String streetAddress) { this.streetAddress = streetAddress; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }

    public Boolean getIsDefault() { return isDefault; }
    public void setIsDefault(Boolean isDefault) { this.isDefault = isDefault; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String recipientName;
        private String phone;
        private String streetAddress;
        private String city;
        private String state;
        private String postalCode;
        private String landmark;
        private Boolean isDefault;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder recipientName(String recipientName) { this.recipientName = recipientName; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder streetAddress(String streetAddress) { this.streetAddress = streetAddress; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder state(String state) { this.state = state; return this; }
        public Builder postalCode(String postalCode) { this.postalCode = postalCode; return this; }
        public Builder landmark(String landmark) { this.landmark = landmark; return this; }
        public Builder isDefault(Boolean isDefault) { this.isDefault = isDefault; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AddressDto build() {
            return new AddressDto(id, recipientName, phone, streetAddress, city, state, postalCode, landmark, isDefault, createdAt);
        }
    }
}
