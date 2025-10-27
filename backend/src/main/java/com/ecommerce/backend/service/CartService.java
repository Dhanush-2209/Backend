package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CartService {

    private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    @Autowired
    private CartItemRepository cartRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductRepository productRepo;

    // ✅ Fetch all cart items for a user
    public List<CartItem> getCartByUser(UUID userId) {
        return cartRepo.findByUserId(userId);
    }

    // ✅ Add product to cart or increment quantity
    public CartItem addToCart(UUID userId, String productId) {
        Optional<CartItem> existing = cartRepo.findByUserIdAndProductId(userId, productId);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + 1);
            CartItem updated = cartRepo.save(item);
            logger.info("Incremented quantity for product {} in cart of user {}", productId, userId);
            return updated;
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem newItem = new CartItem();
        newItem.setUser(user);
        newItem.setProduct(product);
        newItem.setQuantity(1);
        CartItem saved = cartRepo.save(newItem);
        logger.info("Added product {} to cart for user {}", productId, userId);
        return saved;
    }

    // ✅ Update quantity of a cart item
    public CartItem updateCartItem(UUID userId, String productId, int quantity) {
        Optional<CartItem> existing = cartRepo.findByUserIdAndProductId(userId, productId);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(quantity);
            CartItem updated = cartRepo.save(item);
            logger.info("Updated quantity of product {} to {} for user {}", productId, quantity, userId);
            return updated;
        }

        throw new RuntimeException("Cart item not found for user " + userId + " and product " + productId);
    }

    // ✅ Remove item from cart
    @Transactional
    public void removeFromCart(UUID userId, String productId) {
        cartRepo.deleteByUserIdAndProductId(userId, productId);
        logger.info("Removed product {} from cart for user {}", productId, userId);
    }

    // ✅ Clear entire cart
    public void clearCart(UUID userId) {
        List<CartItem> items = cartRepo.findByUserId(userId);
        cartRepo.deleteAll(items);
        logger.info("Cleared cart for user {}", userId);
    }
}
