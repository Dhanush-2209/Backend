package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Address;
import com.ecommerce.backend.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users/{userId}/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping
    public ResponseEntity<List<Address>> getAddresses(@PathVariable UUID userId, Authentication auth) {
        if (!auth.getName().equals(userId.toString())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Address> addresses = addressService.getAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping
    public ResponseEntity<Map<String, Object>> addAddress(@PathVariable UUID userId, @RequestBody Address address, Authentication auth) {
        if (!auth.getName().equals(userId.toString())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        addressService.addAddress(userId, address);
        return ResponseEntity.ok(Map.of("status", "created"));
    }

    // ✅ Update an address
    @PreAuthorize("hasAuthority('USER')")
    @PutMapping("/{addressId}")
    public ResponseEntity<Map<String, Object>> updateAddress(
            @PathVariable UUID userId,
            @PathVariable Long addressId,
            @RequestBody Address updatedAddress,
            Authentication auth) {

        if (!auth.getName().equals(userId.toString())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        boolean success = addressService.updateAddress(userId, addressId, updatedAddress);
        if (!success) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Address not found"));
        }

        return ResponseEntity.ok(Map.of("status", "updated"));
    }

    // ✅ Delete an address
    @PreAuthorize("hasAuthority('USER')")
    @DeleteMapping("/{addressId}")
    public ResponseEntity<Map<String, Object>> deleteAddress(
            @PathVariable UUID userId,
            @PathVariable Long addressId,
            Authentication auth) {

        if (!auth.getName().equals(userId.toString())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        boolean success = addressService.deleteAddress(userId, addressId);
        if (!success) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Address not found"));
        }

        return ResponseEntity.ok(Map.of("status", "deleted"));
    }
}
