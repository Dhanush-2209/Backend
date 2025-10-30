package com.ecommerce.backend.dto;

public class WishlistDTO {
    private String id;
    private WishlistProductDTO product;

    public WishlistDTO(String id, WishlistProductDTO product) {
        this.id = id;
        this.product = product;
    }

    public String getId() { return id; }
    public WishlistProductDTO getProduct() { return product; }

    public void setId(String id) { this.id = id; }
    public void setProduct(WishlistProductDTO product) { this.product = product; }
}
