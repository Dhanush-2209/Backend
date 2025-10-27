package com.ecommerce.backend.dto;

public class AddressDTO {
    private Long id;
    private String name;
    private String phone;
    private String line;
    private String city;
    private String pincode;

    public AddressDTO() {}

    public AddressDTO(Long id, String name, String phone, String line, String city, String pincode) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.line = line;
        this.city = city;
        this.pincode = pincode;
    }

    // ✅ Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getLine() {
        return line;
    }

    public String getCity() {
        return city;
    }

    public String getPincode() {
        return pincode;
    }

    // ✅ Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setLine(String line) {
        this.line = line;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }
}
