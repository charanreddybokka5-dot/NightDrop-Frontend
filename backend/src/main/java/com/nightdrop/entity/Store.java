package com.nightdrop.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "stores")
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(length = 20)
    private String phone;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "opening_time", nullable = false)
    private LocalTime openingTime;

    @Column(name = "closing_time", nullable = false)
    private LocalTime closingTime;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "delivery_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal deliveryFee = BigDecimal.valueOf(39.00);

    @Column
    private Double rating = 4.5;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Store() {}

    public Store(Long id, String name, String description, String address, String phone, String imageUrl,
                 LocalTime openingTime, LocalTime closingTime, Boolean isActive, BigDecimal deliveryFee,
                 Double rating, User owner, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.address = address;
        this.phone = phone;
        this.imageUrl = imageUrl;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.isActive = isActive != null ? isActive : true;
        this.deliveryFee = deliveryFee != null ? deliveryFee : BigDecimal.valueOf(39.00);
        this.rating = rating != null ? rating : 4.5;
        this.owner = owner;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isActive == null) this.isActive = true;
        if (this.deliveryFee == null) this.deliveryFee = BigDecimal.valueOf(39.00);
        if (this.rating == null) this.rating = 4.5;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

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
        private Boolean isActive = true;
        private BigDecimal deliveryFee = BigDecimal.valueOf(39.00);
        private Double rating = 4.5;
        private User owner;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

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
        public Builder owner(User owner) { this.owner = owner; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Store build() {
            return new Store(id, name, description, address, phone, imageUrl, openingTime, closingTime, isActive, deliveryFee, rating, owner, createdAt, updatedAt);
        }
    }
}
