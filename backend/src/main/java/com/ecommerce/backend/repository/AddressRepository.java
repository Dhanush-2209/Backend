package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface AddressRepository extends JpaRepository<Address, Long> {

    // ✅ Explicit query to match user.id inside Address.user
    @Query("SELECT a FROM Address a WHERE a.user.id = :userId")
    List<Address> findByUserId(@Param("userId") UUID userId);
}
