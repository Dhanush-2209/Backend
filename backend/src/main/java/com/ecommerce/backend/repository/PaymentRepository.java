package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Payment;
import com.ecommerce.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByUser(User user);
}
