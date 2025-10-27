package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Address;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.AddressRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepo;

    @Autowired
    private UserRepository userRepo;

    // ✅ Fetch all addresses for a user
    public List<Address> getAddresses(UUID userId) {
        return addressRepo.findByUserId(userId);
    }

    // ✅ Add a single address for a user
    public void addAddress(UUID userId, Address address) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        address.setUser(user); // ✅ Link address to user
        addressRepo.save(address);
    }
}
