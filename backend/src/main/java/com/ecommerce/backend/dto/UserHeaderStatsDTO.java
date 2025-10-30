package com.ecommerce.backend.dto;

public class UserHeaderStatsDTO {
    private int wishlistCount;
    private int cartCount;
    private int savedCardCount;

    public UserHeaderStatsDTO(int wishlistCount, int cartCount, int savedCardCount) {
        this.wishlistCount = wishlistCount;
        this.cartCount = cartCount;
        this.savedCardCount = savedCardCount;
    }

    public int getWishlistCount() { return wishlistCount; }
    public int getCartCount() { return cartCount; }
    public int getSavedCardCount() { return savedCardCount; }

    public void setWishlistCount(int wishlistCount) { this.wishlistCount = wishlistCount; }
    public void setCartCount(int cartCount) { this.cartCount = cartCount; }
    public void setSavedCardCount(int savedCardCount) { this.savedCardCount = savedCardCount; }
}
