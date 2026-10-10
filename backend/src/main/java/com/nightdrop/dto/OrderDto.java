package com.nightdrop.dto;

import com.nightdrop.entity.OrderStatus;
import com.nightdrop.entity.PaymentMethod;
import com.nightdrop.entity.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {
    private Long id;
    private String orderNumber;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private Long storeId;
    private String storeName;
    private String storeAddress;

    private Long deliveryPartnerId;
    private String deliveryPartnerName;
    private String deliveryPartnerPhone;

    private String recipientName;
    private String deliveryPhone;
    private String deliveryAddress;

    private OrderStatus status;
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private BigDecimal totalAmount;

    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String deliveryNotes;

    private List<OrderItemDto> items;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderDto() {}

    public OrderDto(Long id, String orderNumber, Long userId, String customerName, String customerEmail,
                    String customerPhone, Long storeId, String storeName, String storeAddress,
                    Long deliveryPartnerId, String deliveryPartnerName, String deliveryPartnerPhone,
                    String recipientName, String deliveryPhone, String deliveryAddress, OrderStatus status,
                    BigDecimal subtotal, BigDecimal deliveryFee, BigDecimal totalAmount,
                    PaymentMethod paymentMethod, PaymentStatus paymentStatus, String deliveryNotes,
                    List<OrderItemDto> items, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.userId = userId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.storeId = storeId;
        this.storeName = storeName;
        this.storeAddress = storeAddress;
        this.deliveryPartnerId = deliveryPartnerId;
        this.deliveryPartnerName = deliveryPartnerName;
        this.deliveryPartnerPhone = deliveryPartnerPhone;
        this.recipientName = recipientName;
        this.deliveryPhone = deliveryPhone;
        this.deliveryAddress = deliveryAddress;
        this.status = status;
        this.subtotal = subtotal;
        this.deliveryFee = deliveryFee;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.deliveryNotes = deliveryNotes;
        this.items = items;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getStoreAddress() { return storeAddress; }
    public void setStoreAddress(String storeAddress) { this.storeAddress = storeAddress; }

    public Long getDeliveryPartnerId() { return deliveryPartnerId; }
    public void setDeliveryPartnerId(Long deliveryPartnerId) { this.deliveryPartnerId = deliveryPartnerId; }

    public String getDeliveryPartnerName() { return deliveryPartnerName; }
    public void setDeliveryPartnerName(String deliveryPartnerName) { this.deliveryPartnerName = deliveryPartnerName; }

    public String getDeliveryPartnerPhone() { return deliveryPartnerPhone; }
    public void setDeliveryPartnerPhone(String deliveryPartnerPhone) { this.deliveryPartnerPhone = deliveryPartnerPhone; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getDeliveryPhone() { return deliveryPhone; }
    public void setDeliveryPhone(String deliveryPhone) { this.deliveryPhone = deliveryPhone; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getDeliveryNotes() { return deliveryNotes; }
    public void setDeliveryNotes(String deliveryNotes) { this.deliveryNotes = deliveryNotes; }

    public List<OrderItemDto> getItems() { return items; }
    public void setItems(List<OrderItemDto> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String orderNumber;
        private Long userId;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private Long storeId;
        private String storeName;
        private String storeAddress;
        private Long deliveryPartnerId;
        private String deliveryPartnerName;
        private String deliveryPartnerPhone;
        private String recipientName;
        private String deliveryPhone;
        private String deliveryAddress;
        private OrderStatus status;
        private BigDecimal subtotal;
        private BigDecimal deliveryFee;
        private BigDecimal totalAmount;
        private PaymentMethod paymentMethod;
        private PaymentStatus paymentStatus;
        private String deliveryNotes;
        private List<OrderItemDto> items;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder orderNumber(String orderNumber) { this.orderNumber = orderNumber; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder customerEmail(String customerEmail) { this.customerEmail = customerEmail; return this; }
        public Builder customerPhone(String customerPhone) { this.customerPhone = customerPhone; return this; }
        public Builder storeId(Long storeId) { this.storeId = storeId; return this; }
        public Builder storeName(String storeName) { this.storeName = storeName; return this; }
        public Builder storeAddress(String storeAddress) { this.storeAddress = storeAddress; return this; }
        public Builder deliveryPartnerId(Long deliveryPartnerId) { this.deliveryPartnerId = deliveryPartnerId; return this; }
        public Builder deliveryPartnerName(String deliveryPartnerName) { this.deliveryPartnerName = deliveryPartnerName; return this; }
        public Builder deliveryPartnerPhone(String deliveryPartnerPhone) { this.deliveryPartnerPhone = deliveryPartnerPhone; return this; }
        public Builder recipientName(String recipientName) { this.recipientName = recipientName; return this; }
        public Builder deliveryPhone(String deliveryPhone) { this.deliveryPhone = deliveryPhone; return this; }
        public Builder deliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; return this; }
        public Builder status(OrderStatus status) { this.status = status; return this; }
        public Builder subtotal(BigDecimal subtotal) { this.subtotal = subtotal; return this; }
        public Builder deliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; return this; }
        public Builder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public Builder paymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public Builder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public Builder deliveryNotes(String deliveryNotes) { this.deliveryNotes = deliveryNotes; return this; }
        public Builder items(List<OrderItemDto> items) { this.items = items; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public OrderDto build() {
            return new OrderDto(id, orderNumber, userId, customerName, customerEmail, customerPhone,
                    storeId, storeName, storeAddress, deliveryPartnerId, deliveryPartnerName, deliveryPartnerPhone,
                    recipientName, deliveryPhone, deliveryAddress, status, subtotal, deliveryFee, totalAmount,
                    paymentMethod, paymentStatus, deliveryNotes, items, createdAt, updatedAt);
        }
    }
}
