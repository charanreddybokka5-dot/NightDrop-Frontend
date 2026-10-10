package com.nightdrop.controller;

import com.nightdrop.dto.AdminDashboardDto;
import com.nightdrop.dto.OrderDto;
import com.nightdrop.dto.StoreDto;
import com.nightdrop.dto.UserDto;
import com.nightdrop.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboardAnalytics() {
        return ResponseEntity.ok(adminService.getDashboardAnalytics());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/stores")
    public ResponseEntity<List<StoreDto>> getAllStores() {
        return ResponseEntity.ok(adminService.getAllStores());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    @PatchMapping("/stores/{id}/toggle")
    public ResponseEntity<StoreDto> toggleStoreStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleStoreStatus(id));
    }
}
