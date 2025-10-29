package com.ecommerce.backend.dto;

import java.util.List;

public class ProfileDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password; // Optional: only sent if user wants to update it
    private List<AddressDTO> addresses;
    private List<PaymentDTO> payments;

    public ProfileDTO() {}

    public ProfileDTO(String firstName, String lastName, String email, String phone,
                      String password, List<AddressDTO> addresses, List<PaymentDTO> payments) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.addresses = addresses;
        this.payments = payments;
    }

    // Getters
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getPassword() { return password; }
    public List<AddressDTO> getAddresses() { return addresses; }
    public List<PaymentDTO> getPayments() { return payments; }

    // Setters
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setPassword(String password) { this.password = password; }
    public void setAddresses(List<AddressDTO> addresses) { this.addresses = addresses; }
    public void setPayments(List<PaymentDTO> payments) { this.payments = payments; }
}
