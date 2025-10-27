package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.CartItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    // ✅ Fetch all cart items for a user
    List<CartItem> findByUserId(UUID userId);

    // ✅ Find specific cart item by user and product
    Optional<CartItem> findByUserIdAndProductId(UUID userId, String productId);

    // ✅ Delete specific cart item (now accepts String productId)
    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem c WHERE c.user.id = :userId AND c.product.id = :productId")
    void deleteByUserIdAndProductId(@Param("userId") UUID userId, @Param("productId") String productId);
}
