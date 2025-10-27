package com.ecommerce.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String line;
    private String city;
    private String pincode;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore // ✅ Prevent circular reference during JSON serialization
    private User user;

    // ✅ Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getLine() { return line; }
    public String getCity() { return city; }
    public String getPincode() { return pincode; }
    public User getUser() { return user; }

    // ✅ Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setLine(String line) { this.line = line; }
    public void setCity(String city) { this.city = city; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public void setUser(User user) { this.user = user; }
}
