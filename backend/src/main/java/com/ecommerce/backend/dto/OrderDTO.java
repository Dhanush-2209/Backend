package com.ecommerce.backend.dto;

import java.util.List;
import java.util.UUID;

public class OrderDTO {
    private Long id;
    private UUID userId;
    private List<ItemDTO> items;

    private double subtotal;
    private double shipping;
    private double tax;
    private double total;

    private String address;
    private String deliveryDate;
    private String orderedDate;
    private String orderedDay;
    private String orderedTime;
    private String status;
    private String paymentMethod;

    // Getters
    public Long getId() { return id; }
    public UUID getUserId() { return userId; }
    public List<ItemDTO> getItems() { return items; }
    public double getSubtotal() { return subtotal; }
    public double getShipping() { return shipping; }
    public double getTax() { return tax; }
    public double getTotal() { return total; }
    public String getAddress() { return address; }
    public String getDeliveryDate() { return deliveryDate; }
    public String getOrderedDate() { return orderedDate; }
    public String getOrderedDay() { return orderedDay; }
    public String getOrderedTime() { return orderedTime; }
    public String getStatus() { return status; }
    public String getPaymentMethod() { return paymentMethod; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public void setItems(List<ItemDTO> items) { this.items = items; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
    public void setShipping(double shipping) { this.shipping = shipping; }
    public void setTax(double tax) { this.tax = tax; }
    public void setTotal(double total) { this.total = total; }
    public void setAddress(String address) { this.address = address; }
    public void setDeliveryDate(String deliveryDate) { this.deliveryDate = deliveryDate; }
    public void setOrderedDate(String orderedDate) { this.orderedDate = orderedDate; }
    public void setOrderedDay(String orderedDay) { this.orderedDay = orderedDay; }
    public void setOrderedTime(String orderedTime) { this.orderedTime = orderedTime; }
    public void setStatus(String status) { this.status = status; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
