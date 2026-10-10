package com.nightdrop.repository;

import com.nightdrop.entity.Order;
import com.nightdrop.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Order> findByIdAndUserId(Long id, Long userId);
    List<Order> findByStoreIdOrderByCreatedAtDesc(Long storeId);
    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByStatusAndDeliveryPartnerIsNullOrderByCreatedAtAsc(OrderStatus status);
    List<Order> findByDeliveryPartnerIdOrderByCreatedAtDesc(Long deliveryPartnerId);

    long countByStatus(OrderStatus status);
    long countByStatusIn(List<OrderStatus> statuses);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = com.nightdrop.entity.OrderStatus.DELIVERED")
    BigDecimal calculateTotalDeliveredRevenue();

    List<Order> findTop10ByOrderByCreatedAtDesc();
}
