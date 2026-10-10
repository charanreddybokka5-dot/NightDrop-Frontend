package com.nightdrop.controller;

import com.nightdrop.dto.CreateOrderRequest;
import com.nightdrop.dto.OrderDto;
import com.nightdrop.dto.UpdateOrderStatusRequest;
import com.nightdrop.entity.User;
import com.nightdrop.exception.ResourceNotFoundException;
import com.nightdrop.repository.UserRepository;
import com.nightdrop.security.CustomUserDetails;
import com.nightdrop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        OrderDto created = orderService.createOrder(request, user);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderDto>> getMyOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(orderService.getUserOrders(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(orderService.getOrderById(id, user));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<OrderDto> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(orderService.cancelOrder(id, user));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'ADMIN', 'DELIVERY_PARTNER')")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getStatus(), user));
    }

    @GetMapping("/store/{storeId}")
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'ADMIN')")
    public ResponseEntity<List<OrderDto>> getStoreOrders(
            @PathVariable Long storeId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(orderService.getStoreOrders(storeId, user));
    }

    // --- Delivery Partner Endpoints ---

    @GetMapping("/available-deliveries")
    @PreAuthorize("hasAnyRole('DELIVERY_PARTNER', 'STORE_OWNER', 'ADMIN')")
    public ResponseEntity<List<OrderDto>> getAvailableDeliveries() {
        return ResponseEntity.ok(orderService.getAvailableDeliveries());
    }

    @PostMapping("/{id}/claim-delivery")
    @PreAuthorize("hasAnyRole('DELIVERY_PARTNER', 'STORE_OWNER', 'ADMIN')")
    public ResponseEntity<OrderDto> claimDelivery(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(orderService.claimDelivery(id, user));
    }

    @GetMapping("/my-deliveries")
    @PreAuthorize("hasAnyRole('DELIVERY_PARTNER', 'STORE_OWNER', 'ADMIN')")
    public ResponseEntity<List<OrderDto>> getMyDeliveries(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(orderService.getMyDeliveries(user));
    }

    @PostMapping("/{id}/deliver")
    @PreAuthorize("hasAnyRole('DELIVERY_PARTNER', 'STORE_OWNER', 'ADMIN')")
    public ResponseEntity<OrderDto> completeDelivery(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(orderService.completeDelivery(id, user));
    }

    private User getUser(CustomUserDetails userDetails) {
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
