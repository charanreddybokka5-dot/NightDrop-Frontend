package com.nightdrop.dto;

import com.nightdrop.entity.ProductCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ProductRequest {
    private Long storeId;

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Category is required")
    private ProductCategory category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "1.00", message = "Price must be at least 1.00")
    private BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    private String imageUrl;
    private Boolean isAvailable;

    public ProductRequest() {}

    public ProductRequest(Long storeId, String name, String description, ProductCategory category,
                          BigDecimal price, Integer stockQuantity, String imageUrl, Boolean isAvailable) {
        this.storeId = storeId;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.imageUrl = imageUrl;
        this.isAvailable = isAvailable;
    }

    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ProductCategory getCategory() { return category; }
    public void setCategory(ProductCategory category) { this.category = category; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long storeId;
        private String name;
        private String description;
        private ProductCategory category;
        private BigDecimal price;
        private Integer stockQuantity;
        private String imageUrl;
        private Boolean isAvailable;

        public Builder storeId(Long storeId) { this.storeId = storeId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder category(ProductCategory category) { this.category = category; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder stockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder isAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; return this; }

        public ProductRequest build() {
            return new ProductRequest(storeId, name, description, category, price, stockQuantity, imageUrl, isAvailable);
        }
    }
}
