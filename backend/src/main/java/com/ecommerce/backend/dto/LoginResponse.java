package com.ecommerce.backend.dto;

public class LoginResponse {
    private String id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private boolean isAdmin;

    public LoginResponse(String id, String username, String email, String firstName, String lastName, String phone, boolean isAdmin) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.isAdmin = isAdmin;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPhone() {
        return phone;
    }

    public boolean isAdmin() {
        return isAdmin;
    }
}
