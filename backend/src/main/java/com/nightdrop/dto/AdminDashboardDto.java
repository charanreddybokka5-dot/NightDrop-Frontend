package com.nightdrop.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AdminDashboardDto {
    private long totalCustomers;
    private long totalStores;
    private long activeStores;
    private long openStoresNow;
    private long totalProducts;
    private long totalOrders;
    private long activeOrders;
    private long completedOrders;
    private BigDecimal totalDeliveredRevenue;

    private List<OrderDto> recentOrders;
    private Map<String, Long> ordersByStatus;
    private Map<String, Long> categoryCounts;
    private List<ProductDto> popularProducts;

    public AdminDashboardDto() {}

    public AdminDashboardDto(long totalCustomers, long totalStores, long activeStores, long openStoresNow,
                             long totalProducts, long totalOrders, long activeOrders, long completedOrders,
                             BigDecimal totalDeliveredRevenue, List<OrderDto> recentOrders,
                             Map<String, Long> ordersByStatus, Map<String, Long> categoryCounts,
                             List<ProductDto> popularProducts) {
        this.totalCustomers = totalCustomers;
        this.totalStores = totalStores;
        this.activeStores = activeStores;
        this.openStoresNow = openStoresNow;
        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.activeOrders = activeOrders;
        this.completedOrders = completedOrders;
        this.totalDeliveredRevenue = totalDeliveredRevenue;
        this.recentOrders = recentOrders;
        this.ordersByStatus = ordersByStatus;
        this.categoryCounts = categoryCounts;
        this.popularProducts = popularProducts;
    }

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getTotalStores() { return totalStores; }
    public void setTotalStores(long totalStores) { this.totalStores = totalStores; }

    public long getActiveStores() { return activeStores; }
    public void setActiveStores(long activeStores) { this.activeStores = activeStores; }

    public long getOpenStoresNow() { return openStoresNow; }
    public void setOpenStoresNow(long openStoresNow) { this.openStoresNow = openStoresNow; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getActiveOrders() { return activeOrders; }
    public void setActiveOrders(long activeOrders) { this.activeOrders = activeOrders; }

    public long getCompletedOrders() { return completedOrders; }
    public void setCompletedOrders(long completedOrders) { this.completedOrders = completedOrders; }

    public BigDecimal getTotalDeliveredRevenue() { return totalDeliveredRevenue; }
    public void setTotalDeliveredRevenue(BigDecimal totalDeliveredRevenue) { this.totalDeliveredRevenue = totalDeliveredRevenue; }

    public List<OrderDto> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderDto> recentOrders) { this.recentOrders = recentOrders; }

    public Map<String, Long> getOrdersByStatus() { return ordersByStatus; }
    public void setOrdersByStatus(Map<String, Long> ordersByStatus) { this.ordersByStatus = ordersByStatus; }

    public Map<String, Long> getCategoryCounts() { return categoryCounts; }
    public void setCategoryCounts(Map<String, Long> categoryCounts) { this.categoryCounts = categoryCounts; }

    public List<ProductDto> getPopularProducts() { return popularProducts; }
    public void setPopularProducts(List<ProductDto> popularProducts) { this.popularProducts = popularProducts; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalCustomers;
        private long totalStores;
        private long activeStores;
        private long openStoresNow;
        private long totalProducts;
        private long totalOrders;
        private long activeOrders;
        private long completedOrders;
        private BigDecimal totalDeliveredRevenue;
        private List<OrderDto> recentOrders;
        private Map<String, Long> ordersByStatus;
        private Map<String, Long> categoryCounts;
        private List<ProductDto> popularProducts;

        public Builder totalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; return this; }
        public Builder totalStores(long totalStores) { this.totalStores = totalStores; return this; }
        public Builder activeStores(long activeStores) { this.activeStores = activeStores; return this; }
        public Builder openStoresNow(long openStoresNow) { this.openStoresNow = openStoresNow; return this; }
        public Builder totalProducts(long totalProducts) { this.totalProducts = totalProducts; return this; }
        public Builder totalOrders(long totalOrders) { this.totalOrders = totalOrders; return this; }
        public Builder activeOrders(long activeOrders) { this.activeOrders = activeOrders; return this; }
        public Builder completedOrders(long completedOrders) { this.completedOrders = completedOrders; return this; }
        public Builder totalDeliveredRevenue(BigDecimal totalDeliveredRevenue) { this.totalDeliveredRevenue = totalDeliveredRevenue; return this; }
        public Builder recentOrders(List<OrderDto> recentOrders) { this.recentOrders = recentOrders; return this; }
        public Builder ordersByStatus(Map<String, Long> ordersByStatus) { this.ordersByStatus = ordersByStatus; return this; }
        public Builder categoryCounts(Map<String, Long> categoryCounts) { this.categoryCounts = categoryCounts; return this; }
        public Builder popularProducts(List<ProductDto> popularProducts) { this.popularProducts = popularProducts; return this; }

        public AdminDashboardDto build() {
            return new AdminDashboardDto(totalCustomers, totalStores, activeStores, openStoresNow, totalProducts,
                    totalOrders, activeOrders, completedOrders, totalDeliveredRevenue, recentOrders, ordersByStatus, categoryCounts, popularProducts);
        }
    }
}
