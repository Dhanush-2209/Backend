package com.ecommerce.backend.dto;

public class UserSummaryDTO {
    private String id;
    private String name;
    private String email;
    private String address;
    private int totalItems;
    private double totalPrice;

    // ✅ Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getAddress() { return address; }
    public int getTotalItems() { return totalItems; }
    public double getTotalPrice() { return totalPrice; }

    // ✅ Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setAddress(String address) { this.address = address; }
    public void setTotalItems(int totalItems) { this.totalItems = totalItems; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
}
