package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.DeliveryAgent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryAgentRepository extends JpaRepository<DeliveryAgent, Long> {
}
