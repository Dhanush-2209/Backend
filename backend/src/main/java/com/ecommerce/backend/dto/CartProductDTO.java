package com.ecommerce.backend.dto;

public class CartProductDTO {
    private String id;
    private String title;
    private String thumbnail;
    private String description;
    private double price;
    private int quantity;
    private String category;
    private String brand;
    private String unit;

    public CartProductDTO(
            String id,
            String title,
            String thumbnail,
            String description,
            double price,
            int quantity,
            String category,
            String brand,
            String unit
    ) {
        this.id = id;
        this.title = title;
        this.thumbnail = thumbnail;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
        this.brand = brand;
        this.unit = unit;
    }

    // ✅ Getters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getThumbnail() { return thumbnail; }
    public String getDescription() { return description; }
    public double getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public String getCategory() { return category; }
    public String getBrand() { return brand; }
    public String getUnit() { return unit; }

    // ✅ Optional: Setters (if needed for deserialization)
    public void setId(String id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(double price) { this.price = price; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public void setCategory(String category) { this.category = category; }
    public void setBrand(String brand) { this.brand = brand; }
    public void setUnit(String unit) { this.unit = unit; }
}
