package com.nightdrop.service;

import com.nightdrop.dto.AdminDashboardDto;
import com.nightdrop.dto.OrderDto;
import com.nightdrop.dto.ProductDto;
import com.nightdrop.dto.StoreDto;
import com.nightdrop.dto.UserDto;
import com.nightdrop.entity.OrderStatus;
import com.nightdrop.entity.ProductCategory;
import com.nightdrop.entity.Role;
import com.nightdrop.entity.Store;
import com.nightdrop.entity.User;
import com.nightdrop.exception.ResourceNotFoundException;
import com.nightdrop.repository.OrderRepository;
import com.nightdrop.repository.ProductRepository;
import com.nightdrop.repository.StoreRepository;
import com.nightdrop.repository.UserRepository;
import com.nightdrop.util.TimeUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final StoreService storeService;
    private final ProductService productService;
    private final OrderService orderService;
    private final TimeUtil timeUtil;

    public AdminService(UserRepository userRepository,
                        StoreRepository storeRepository,
                        ProductRepository productRepository,
                        OrderRepository orderRepository,
                        StoreService storeService,
                        ProductService productService,
                        OrderService orderService,
                        TimeUtil timeUtil) {
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.storeService = storeService;
        this.productService = productService;
        this.orderService = orderService;
        this.timeUtil = timeUtil;
    }

    @Transactional(readOnly = true)
    public AdminDashboardDto getDashboardAnalytics() {
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long totalStores = storeRepository.count();
        long activeStores = storeRepository.countByIsActiveTrue();
        long openStoresNow = storeRepository.findByIsActiveTrue()
                .stream()
                .filter(timeUtil::isStoreOpen)
                .count();

        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();

        List<OrderStatus> activeStatuses = Arrays.asList(
                OrderStatus.PLACED,
                OrderStatus.ACCEPTED,
                OrderStatus.PREPARING,
                OrderStatus.READY_FOR_PICKUP,
                OrderStatus.OUT_FOR_DELIVERY
        );
        long activeOrders = orderRepository.countByStatusIn(activeStatuses);
        long completedOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);

        BigDecimal totalRevenue = orderRepository.calculateTotalDeliveredRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        List<OrderDto> recentOrders = orderRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(orderService::mapToDto)
                .collect(Collectors.toList());

        Map<String, Long> ordersByStatus = new LinkedHashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            ordersByStatus.put(status.name(), orderRepository.countByStatus(status));
        }

        Map<String, Long> categoryCounts = new LinkedHashMap<>();
        for (ProductCategory category : ProductCategory.values()) {
            categoryCounts.put(category.getDisplayName(), productRepository.countByCategory(category));
        }

        List<ProductDto> popularProducts = productRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .limit(8)
                .map(productService::mapToDto)
                .collect(Collectors.toList());

        return AdminDashboardDto.builder()
                .totalCustomers(totalCustomers)
                .totalStores(totalStores)
                .activeStores(activeStores)
                .openStoresNow(openStoresNow)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .activeOrders(activeOrders)
                .completedOrders(completedOrders)
                .totalDeliveredRevenue(totalRevenue)
                .recentOrders(recentOrders)
                .ordersByStatus(ordersByStatus)
                .categoryCounts(categoryCounts)
                .popularProducts(popularProducts)
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(u -> UserDto.builder()
                        .id(u.getId())
                        .email(u.getEmail())
                        .fullName(u.getFullName())
                        .phone(u.getPhone())
                        .role(u.getRole())
                        .createdAt(u.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StoreDto> getAllStores() {
        return storeService.getAllStores();
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(orderService::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public StoreDto toggleStoreStatus(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));
        store.setIsActive(!Boolean.TRUE.equals(store.getIsActive()));
        Store updated = storeRepository.save(store);
        return storeService.mapToDto(updated);
    }
}
