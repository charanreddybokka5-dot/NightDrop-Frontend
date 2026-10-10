package com.nightdrop.dto;

import com.nightdrop.entity.ProductCategory;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDto {
    private Long id;
    private Long storeId;
    private String storeName;
    private String name;
    private String description;
    private ProductCategory category;
    private String categoryDisplayName;
    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private Boolean isAvailable;
    private Boolean isStoreOpen;
    private LocalDateTime createdAt;

    public ProductDto() {}

    public ProductDto(Long id, Long storeId, String storeName, String name, String description,
                      ProductCategory category, String categoryDisplayName, BigDecimal price,
                      Integer stockQuantity, String imageUrl, Boolean isAvailable,
                      Boolean isStoreOpen, LocalDateTime createdAt) {
        this.id = id;
        this.storeId = storeId;
        this.storeName = storeName;
        this.name = name;
        this.description = description;
        this.category = category;
        this.categoryDisplayName = categoryDisplayName;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.imageUrl = imageUrl;
        this.isAvailable = isAvailable;
        this.isStoreOpen = isStoreOpen;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ProductCategory getCategory() { return category; }
    public void setCategory(ProductCategory category) { this.category = category; }

    public String getCategoryDisplayName() { return categoryDisplayName; }
    public void setCategoryDisplayName(String categoryDisplayName) { this.categoryDisplayName = categoryDisplayName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public Boolean getIsStoreOpen() { return isStoreOpen; }
    public void setIsStoreOpen(Boolean isStoreOpen) { this.isStoreOpen = isStoreOpen; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long storeId;
        private String storeName;
        private String name;
        private String description;
        private ProductCategory category;
        private String categoryDisplayName;
        private BigDecimal price;
        private Integer stockQuantity;
        private String imageUrl;
        private Boolean isAvailable;
        private Boolean isStoreOpen;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder storeId(Long storeId) { this.storeId = storeId; return this; }
        public Builder storeName(String storeName) { this.storeName = storeName; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder category(ProductCategory category) { this.category = category; return this; }
        public Builder categoryDisplayName(String categoryDisplayName) { this.categoryDisplayName = categoryDisplayName; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder stockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder isAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; return this; }
        public Builder isStoreOpen(Boolean isStoreOpen) { this.isStoreOpen = isStoreOpen; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ProductDto build() {
            return new ProductDto(id, storeId, storeName, name, description, category, categoryDisplayName, price, stockQuantity, imageUrl, isAvailable, isStoreOpen, createdAt);
        }
    }
}
