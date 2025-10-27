package com.ecommerce.backend.dto;

public class ItemDTO {
    private String name;
    private double price;
    private int qty;

    private String unit;
    private String brand;
    private String category;
    private String sku;
    private String description;
    private String image;

    // Getters
    public String getName() { return name; }
    public double getPrice() { return price; }
    public int getQty() { return qty; }
    public String getUnit() { return unit; }
    public String getBrand() { return brand; }
    public String getCategory() { return category; }
    public String getSku() { return sku; }
    public String getDescription() { return description; }
    public String getImage() { return image; }

    // Setters
    public void setName(String name) { this.name = name; }
    public void setPrice(double price) { this.price = price; }
    public void setQty(int qty) { this.qty = qty; }
    public void setUnit(String unit) { this.unit = unit; }
    public void setBrand(String brand) { this.brand = brand; }
    public void setCategory(String category) { this.category = category; }
    public void setSku(String sku) { this.sku = sku; }
    public void setDescription(String description) { this.description = description; }
    public void setImage(String image) { this.image = image; }
}