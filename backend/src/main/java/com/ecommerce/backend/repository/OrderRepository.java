package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(UUID userId);
}
