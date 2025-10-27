package com.ecommerce.backend.dto;

public class WishlistProductDTO {
    private String id;
    private String title;
    private String thumbnail;
    private String description;
    private double price;

    public WishlistProductDTO(
            String id,
            String title,
            String thumbnail,
            String description,
            double price
    ) {
        this.id = id;
        this.title = title;
        this.thumbnail = thumbnail;
        this.description = description;
        this.price = price;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }
}
