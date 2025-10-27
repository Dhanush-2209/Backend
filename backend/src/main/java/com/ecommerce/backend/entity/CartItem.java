package com.ecommerce.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "user_cart")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore // ✅ Prevents serialization issues with lazy-loaded user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JsonIgnore // ✅ Prevents serialization issues with lazy-loaded product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int quantity;

    // ✅ Getters
    public UUID getId() { return id; }
    public User getUser() { return user; }
    public Product getProduct() { return product; }
    public int getQuantity() { return quantity; }

    // ✅ Setters
    public void setId(UUID id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setProduct(Product product) { this.product = product; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    // ✅ Optional: for logging/debugging
    @Override
    public String toString() {
        return "CartItem{" +
                "id=" + id +
                ", product=" + (product != null ? product.getTitle() : "null") +
                ", quantity=" + quantity +
                '}';
    }
}
