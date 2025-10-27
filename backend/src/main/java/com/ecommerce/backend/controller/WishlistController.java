package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.WishlistProductDTO;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.WishlistItem;
import com.ecommerce.backend.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/users/{userId}/wishlist")
    public ResponseEntity<List<WishlistProductDTO>> getWishlist(@PathVariable UUID userId) {
        List<WishlistItem> items = wishlistService.getWishlistByUser(userId);

        List<WishlistProductDTO> response = items.stream()
                .map(item -> {
                    Product p = item.getProduct();
                    return new WishlistProductDTO(
                            p.getId(),
                            p.getTitle(),
                            p.getThumbnail(),
                            p.getDescription(),
                            p.getPrice()
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/{userId}/wishlist/{productId}")
    public ResponseEntity<Map<String, String>> addToWishlist(@PathVariable UUID userId, @PathVariable String productId) {
        wishlistService.addToWishlist(userId, productId);
        return ResponseEntity.ok(Map.of("status", "added"));
    }

    @DeleteMapping("/users/{userId}/wishlist/{productId}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(@PathVariable UUID userId, @PathVariable String productId) {
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok(Map.of("status", "removed"));
    }
}
