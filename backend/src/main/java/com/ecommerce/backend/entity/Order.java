package com.ecommerce.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Item> items;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getShipping() { return shipping; }
    public void setShipping(double shipping) { this.shipping = shipping; }

    public double getTax() { return tax; }
    public void setTax(double tax) { this.tax = tax; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(String deliveryDate) { this.deliveryDate = deliveryDate; }

    public String getOrderedDate() { return orderedDate; }
    public void setOrderedDate(String orderedDate) { this.orderedDate = orderedDate; }

    public String getOrderedDay() { return orderedDay; }
    public void setOrderedDay(String orderedDay) { this.orderedDay = orderedDay; }

    public String getOrderedTime() { return orderedTime; }
    public void setOrderedTime(String orderedTime) { this.orderedTime = orderedTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
}
