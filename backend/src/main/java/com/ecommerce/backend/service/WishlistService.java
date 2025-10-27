package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.WishlistItem;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.repository.WishlistItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WishlistService {

    private static final Logger logger = LoggerFactory.getLogger(WishlistService.class);

    @Autowired
    private WishlistItemRepository wishlistRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductRepository productRepo;

    public List<WishlistItem> getWishlistByUser(UUID userId) {
        return wishlistRepo.findByUserId(userId);
    }

    public void addToWishlist(UUID userId, String productId) {
        Optional<WishlistItem> existing = wishlistRepo.findByUserIdAndProductId(userId, productId);
        if (existing.isPresent()) {
            logger.info("Wishlist item already exists for user {} and product {}", userId, productId);
            return;
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);
        wishlistRepo.save(item);
        logger.info("Added product {} to wishlist for user {}", productId, userId);
    }

    public void removeFromWishlist(UUID userId, String productId) {
        wishlistRepo.deleteByUserIdAndProductId(userId, productId);
        logger.info("Removed product {} from wishlist for user {}", productId, userId);
    }
}
