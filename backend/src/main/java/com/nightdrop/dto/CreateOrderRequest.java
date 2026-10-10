package com.nightdrop.dto;

import com.nightdrop.entity.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CreateOrderRequest {
    @NotNull(message = "Store ID is required")
    private Long storeId;

    @NotBlank(message = "Recipient name is required")
    private String recipientName;

    @NotBlank(message = "Delivery phone number is required")
    private String deliveryPhone;

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    private String deliveryNotes;

    private PaymentMethod paymentMethod = PaymentMethod.CASH_ON_DELIVERY;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;

    public CreateOrderRequest() {}

    public CreateOrderRequest(Long storeId, String recipientName, String deliveryPhone,
                              String deliveryAddress, String deliveryNotes, PaymentMethod paymentMethod,
                              List<OrderItemRequest> items) {
        this.storeId = storeId;
        this.recipientName = recipientName;
        this.deliveryPhone = deliveryPhone;
        this.deliveryAddress = deliveryAddress;
        this.deliveryNotes = deliveryNotes;
        this.paymentMethod = paymentMethod != null ? paymentMethod : PaymentMethod.CASH_ON_DELIVERY;
        this.items = items;
    }

    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getDeliveryPhone() { return deliveryPhone; }
    public void setDeliveryPhone(String deliveryPhone) { this.deliveryPhone = deliveryPhone; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getDeliveryNotes() { return deliveryNotes; }
    public void setDeliveryNotes(String deliveryNotes) { this.deliveryNotes = deliveryNotes; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long storeId;
        private String recipientName;
        private String deliveryPhone;
        private String deliveryAddress;
        private String deliveryNotes;
        private PaymentMethod paymentMethod = PaymentMethod.CASH_ON_DELIVERY;
        private List<OrderItemRequest> items;

        public Builder storeId(Long storeId) { this.storeId = storeId; return this; }
        public Builder recipientName(String recipientName) { this.recipientName = recipientName; return this; }
        public Builder deliveryPhone(String deliveryPhone) { this.deliveryPhone = deliveryPhone; return this; }
        public Builder deliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; return this; }
        public Builder deliveryNotes(String deliveryNotes) { this.deliveryNotes = deliveryNotes; return this; }
        public Builder paymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public Builder items(List<OrderItemRequest> items) { this.items = items; return this; }

        public CreateOrderRequest build() {
            return new CreateOrderRequest(storeId, recipientName, deliveryPhone, deliveryAddress, deliveryNotes, paymentMethod, items);
        }
    }
}
