package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.CartProductDTO;
import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class CartController {

    @Autowired
    private CartService cartService;

    // ✅ Get all cart items for a user (returns DTOs)
    @GetMapping("/users/{userId}/cart")
    public ResponseEntity<List<CartProductDTO>> getCart(@PathVariable UUID userId) {
        List<CartItem> items = cartService.getCartByUser(userId);

        List<CartProductDTO> response = items.stream()
                .map(item -> {
                    Product p = item.getProduct();
                    return new CartProductDTO(
                            p.getId(),
                            p.getTitle(),
                            p.getThumbnail(),
                            p.getDescription(),
                            p.getPrice(),
                            item.getQuantity(),
                            p.getCategory(),
                            p.getBrand(),
                            null // ✅ No unit field in Product, so we pass null
                    );
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    // ✅ Add product to cart
    @PostMapping("/users/{userId}/cart/{productId}")
    public ResponseEntity<CartItem> addToCart(@PathVariable UUID userId, @PathVariable String productId) {
        CartItem added = cartService.addToCart(userId, productId);
        return ResponseEntity.ok(added);
    }

    // ✅ Update quantity of a cart item
    @PatchMapping("/users/{userId}/cart/{productId}")
    public ResponseEntity<Map<String, String>> updateCartItem(
            @PathVariable UUID userId,
            @PathVariable String productId,
            @RequestBody Map<String, Integer> body
    ) {
        Integer quantity = body.get("quantity");
        if (quantity == null || quantity < 1) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid quantity"));
        }
        cartService.updateCartItem(userId, productId, quantity);
        return ResponseEntity.ok(Map.of("status", "updated"));
    }

    // ✅ Remove product from cart
    @DeleteMapping("/users/{userId}/cart/{productId}")
    public ResponseEntity<Map<String, String>> removeFromCart(@PathVariable UUID userId, @PathVariable String productId) {
        cartService.removeFromCart(userId, productId);
        return ResponseEntity.ok(Map.of("status", "removed"));
    }

    // ✅ Clear entire cart
    @DeleteMapping("/users/{userId}/cart")
    public ResponseEntity<Map<String, String>> clearCart(@PathVariable UUID userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of("status", "cleared"));
    }

    // ✅ NEW: Remove multiple selected items from cart
    @DeleteMapping("/users/{userId}/cart/items")
    public ResponseEntity<Map<String, String>> removeMultipleItems(
            @PathVariable UUID userId,
            @RequestBody Map<String, List<String>> body
    ) {
        List<String> productIds = body.get("productIds");
        if (productIds == null || productIds.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No product IDs provided"));
        }

        cartService.removeMultipleFromCart(userId, productIds);
        return ResponseEntity.ok(Map.of("status", "selected items removed"));
    }
}
