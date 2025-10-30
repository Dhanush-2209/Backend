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

    public List<Address> getAddresses(UUID userId) {
        return addressRepo.findByUserId(userId);
    }

    public void addAddress(UUID userId, Address address) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        address.setUser(user);
        addressRepo.save(address);
    }

    // ✅ Update an address
    public boolean updateAddress(UUID userId, Long addressId, Address updatedAddress) {
        Optional<Address> existingOpt = addressRepo.findById(addressId);
        if (existingOpt.isEmpty()) return false;

        Address existing = existingOpt.get();
        if (!existing.getUser().getId().equals(userId)) return false;

        existing.setName(updatedAddress.getName());
        existing.setPhone(updatedAddress.getPhone());
        existing.setLine(updatedAddress.getLine());
        existing.setCity(updatedAddress.getCity());
        existing.setPincode(updatedAddress.getPincode());

        addressRepo.save(existing);
        return true;
    }

    // ✅ Delete an address
    public boolean deleteAddress(UUID userId, Long addressId) {
        Optional<Address> existingOpt = addressRepo.findById(addressId);
        if (existingOpt.isEmpty()) return false;

        Address existing = existingOpt.get();
        if (!existing.getUser().getId().equals(userId)) return false;

        addressRepo.delete(existing);
        return true;
    }
}
