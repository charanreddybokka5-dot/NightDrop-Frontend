package com.nightdrop.service;

import com.nightdrop.dto.CreateOrderRequest;
import com.nightdrop.dto.OrderDto;
import com.nightdrop.dto.OrderItemDto;
import com.nightdrop.dto.OrderItemRequest;
import com.nightdrop.entity.*;
import com.nightdrop.exception.BadRequestException;
import com.nightdrop.exception.ResourceNotFoundException;
import com.nightdrop.exception.UnauthorizedException;
import com.nightdrop.repository.OrderRepository;
import com.nightdrop.repository.ProductRepository;
import com.nightdrop.repository.StoreRepository;
import com.nightdrop.util.OrderIdGenerator;
import com.nightdrop.util.TimeUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final TimeUtil timeUtil;
    private final OrderIdGenerator orderIdGenerator;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            StoreRepository storeRepository,
            TimeUtil timeUtil,
            OrderIdGenerator orderIdGenerator
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.timeUtil = timeUtil;
        this.orderIdGenerator = orderIdGenerator;
    }

    @Transactional
    public OrderDto createOrder(CreateOrderRequest request, User customer) {
        Store store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + request.getStoreId()));

        if (!store.getIsActive()) {
            throw new BadRequestException("Store '" + store.getName() + "' is currently deactivated.");
        }

        // Night availability enforcement
        if (!timeUtil.isStoreOpen(store)) {
            throw new BadRequestException(
                    "Store '" + store.getName() + "' is currently closed. Operating hours are " +
                    store.getOpeningTime() + " to " + store.getClosingTime() + " IST."
            );
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order must contain at least one item.");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemReq.getProductId()));

            if (!product.getStore().getId().equals(store.getId())) {
                throw new BadRequestException("Product '" + product.getName() + "' does not belong to store '" + store.getName() + "'.");
            }

            if (!Boolean.TRUE.equals(product.getIsAvailable())) {
                throw new BadRequestException("Product '" + product.getName() + "' is currently unavailable.");
            }

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new BadRequestException(
                        "Insufficient stock for '" + product.getName() + "'. Only " +
                        product.getStockQuantity() + " item(s) left in stock."
                );
            }

            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            if (product.getStockQuantity() == 0) {
                product.setIsAvailable(false);
            }
            productRepository.save(product);

            BigDecimal itemSubtotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .price(product.getPrice())
                    .quantity(itemReq.getQuantity())
                    .subtotal(itemSubtotal)
                    .build();

            orderItems.add(orderItem);
        }

        BigDecimal deliveryFee = store.getDeliveryFee() != null ? store.getDeliveryFee() : BigDecimal.valueOf(39.00);
        BigDecimal totalAmount = subtotal.add(deliveryFee);

        PaymentMethod paymentMethod = request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.CASH_ON_DELIVERY;
        PaymentStatus paymentStatus = (paymentMethod == PaymentMethod.SIMULATED_ONLINE) ? PaymentStatus.COMPLETED : PaymentStatus.PENDING;

        Order order = Order.builder()
                .orderNumber(orderIdGenerator.generateOrderNumber())
                .user(customer)
                .store(store)
                .recipientName(request.getRecipientName().trim())
                .deliveryPhone(request.getDeliveryPhone().trim())
                .deliveryAddress(request.getDeliveryAddress().trim())
                .deliveryNotes(request.getDeliveryNotes())
                .status(OrderStatus.PLACED)
                .subtotal(subtotal)
                .deliveryFee(deliveryFee)
                .totalAmount(totalAmount)
                .paymentMethod(paymentMethod)
                .paymentStatus(paymentStatus)
                .build();

        for (OrderItem item : orderItems) {
            order.addItem(item);
        }

        Order savedOrder = orderRepository.save(order);
        return mapToDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrders(User user) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long id, User currentUser) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        boolean isCustomer = order.getUser().getId().equals(currentUser.getId());
        boolean isStoreOwner = order.getStore().getOwner().getId().equals(currentUser.getId());
        boolean isDeliveryPartner = order.getDeliveryPartner() != null && order.getDeliveryPartner().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isEligibleRider = currentUser.getRole() == Role.DELIVERY_PARTNER;

        if (!isCustomer && !isStoreOwner && !isDeliveryPartner && !isAdmin && !isEligibleRider) {
            throw new UnauthorizedException("You are not authorized to view this order");
        }

        return mapToDto(order);
    }

    @Transactional
    public OrderDto cancelOrder(Long id, User currentUser) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        boolean isCustomer = order.getUser().getId().equals(currentUser.getId());
        boolean isStoreOwner = order.getStore().getOwner().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isCustomer && !isStoreOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to cancel this order");
        }

        if (isCustomer && !isAdmin && !isStoreOwner && order.getStatus() != OrderStatus.PLACED) {
            throw new BadRequestException("Order cannot be cancelled once accepted or in preparation. Current status: " + order.getStatus());
        }

        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.REJECTED) {
            throw new BadRequestException("Order cannot be cancelled because it is already " + order.getStatus());
        }

        restoreStock(order);

        order.setStatus(OrderStatus.CANCELLED);
        order.setPaymentStatus(PaymentStatus.CANCELLED);
        Order updated = orderRepository.save(order);
        return mapToDto(updated);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long id, OrderStatus newStatus, User currentUser) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        boolean isStoreOwner = order.getStore().getOwner().getId().equals(currentUser.getId());
        boolean isAssignedRider = order.getDeliveryPartner() != null && order.getDeliveryPartner().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isStoreOwner && !isAssignedRider && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to update this order's status");
        }

        validateStatusTransition(order.getStatus(), newStatus);

        if (newStatus == OrderStatus.REJECTED) {
            restoreStock(order);
            order.setPaymentStatus(PaymentStatus.CANCELLED);
        } else if (newStatus == OrderStatus.DELIVERED) {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
        }

        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);
        return mapToDto(updated);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getStoreOrders(Long storeId, User currentUser) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));

        boolean isStoreOwner = store.getOwner().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isStoreOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to view orders for this store");
        }

        return orderRepository.findByStoreIdOrderByCreatedAtDesc(storeId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // --- Delivery Partner Specific Operations ---

    @Transactional(readOnly = true)
    public List<OrderDto> getAvailableDeliveries() {
        return orderRepository.findByStatusAndDeliveryPartnerIsNullOrderByCreatedAtAsc(OrderStatus.READY_FOR_PICKUP)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto claimDelivery(Long orderId, User deliveryPartner) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getDeliveryPartner() != null) {
            throw new BadRequestException("Order ND-" + order.getOrderNumber() + " has already been claimed by another delivery partner.");
        }

        if (order.getStatus() != OrderStatus.READY_FOR_PICKUP) {
            throw new BadRequestException("Order is not ready for pickup. Current status: " + order.getStatus());
        }

        order.setDeliveryPartner(deliveryPartner);
        order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        Order updated = orderRepository.save(order);
        return mapToDto(updated);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getMyDeliveries(User deliveryPartner) {
        return orderRepository.findByDeliveryPartnerIdOrderByCreatedAtDesc(deliveryPartner.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto completeDelivery(Long orderId, User deliveryPartner) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        boolean isAssigned = order.getDeliveryPartner() != null && order.getDeliveryPartner().getId().equals(deliveryPartner.getId());
        boolean isAdmin = deliveryPartner.getRole() == Role.ADMIN;

        if (!isAssigned && !isAdmin) {
            throw new UnauthorizedException("You are not the assigned delivery partner for this order");
        }

        if (order.getStatus() != OrderStatus.OUT_FOR_DELIVERY) {
            throw new BadRequestException("Order is not currently out for delivery. Current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.DELIVERED);
        order.setPaymentStatus(PaymentStatus.COMPLETED);
        Order updated = orderRepository.save(order);
        return mapToDto(updated);
    }

    // --- Helper methods ---

    private void restoreStock(Order order) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            if (product != null) {
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                if (product.getStockQuantity() > 0) {
                    product.setIsAvailable(true);
                }
                productRepository.save(product);
            }
        }
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        if (current == next) {
            return;
        }

        if (current == OrderStatus.DELIVERED || current == OrderStatus.CANCELLED || current == OrderStatus.REJECTED) {
            throw new BadRequestException("Cannot update status of an order that is already " + current);
        }

        switch (current) {
            case PLACED -> {
                if (next != OrderStatus.ACCEPTED && next != OrderStatus.REJECTED && next != OrderStatus.CANCELLED) {
                    throw new BadRequestException("Order in PLACED status can only transition to ACCEPTED, REJECTED, or CANCELLED");
                }
            }
            case ACCEPTED -> {
                if (next != OrderStatus.PREPARING && next != OrderStatus.CANCELLED) {
                    throw new BadRequestException("Order in ACCEPTED status can only transition to PREPARING or CANCELLED");
                }
            }
            case PREPARING -> {
                if (next != OrderStatus.READY_FOR_PICKUP && next != OrderStatus.CANCELLED) {
                    throw new BadRequestException("Order in PREPARING status can only transition to READY_FOR_PICKUP or CANCELLED");
                }
            }
            case READY_FOR_PICKUP -> {
                if (next != OrderStatus.OUT_FOR_DELIVERY && next != OrderStatus.CANCELLED) {
                    throw new BadRequestException("Order in READY_FOR_PICKUP status can only transition to OUT_FOR_DELIVERY or CANCELLED");
                }
            }
            case OUT_FOR_DELIVERY -> {
                if (next != OrderStatus.DELIVERED && next != OrderStatus.CANCELLED) {
                    throw new BadRequestException("Order in OUT_FOR_DELIVERY status can only transition to DELIVERED or CANCELLED");
                }
            }
            default -> throw new BadRequestException("Invalid status transition from " + current + " to " + next);
        }
    }

    public OrderDto mapToDto(Order order) {
        List<OrderItemDto> itemDtos = order.getItems().stream().map(item -> OrderItemDto.builder()
                .id(item.getId())
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProductName())
                .productImage(item.getProduct() != null ? item.getProduct().getImageUrl() : null)
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .build()
        ).collect(Collectors.toList());

        return OrderDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser().getId())
                .customerName(order.getUser().getFullName())
                .customerEmail(order.getUser().getEmail())
                .customerPhone(order.getUser().getPhone())
                .storeId(order.getStore().getId())
                .storeName(order.getStore().getName())
                .storeAddress(order.getStore().getAddress())
                .deliveryPartnerId(order.getDeliveryPartner() != null ? order.getDeliveryPartner().getId() : null)
                .deliveryPartnerName(order.getDeliveryPartner() != null ? order.getDeliveryPartner().getFullName() : null)
                .deliveryPartnerPhone(order.getDeliveryPartner() != null ? order.getDeliveryPartner().getPhone() : null)
                .recipientName(order.getRecipientName())
                .deliveryPhone(order.getDeliveryPhone())
                .deliveryAddress(order.getDeliveryAddress())
                .status(order.getStatus())
                .subtotal(order.getSubtotal())
                .deliveryFee(order.getDeliveryFee())
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .deliveryNotes(order.getDeliveryNotes())
                .items(itemDtos)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
