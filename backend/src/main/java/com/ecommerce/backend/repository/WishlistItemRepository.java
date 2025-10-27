package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.WishlistItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, UUID> {

    List<WishlistItem> findByUserId(UUID userId);

    Optional<WishlistItem> findByUserIdAndProductId(UUID userId, String productId);

    @Transactional
    @Modifying
    @Query("DELETE FROM WishlistItem w WHERE w.user.id = :userId AND w.product.id = :productId")
    void deleteByUserIdAndProductId(UUID userId, String productId);
}
