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

    // ✅ Get all addresses for a user
    @PreAuthorize("hasAuthority('USER')")
    @GetMapping
    public ResponseEntity<List<Address>> getAddresses(@PathVariable UUID userId, Authentication auth) {
        if (!auth.getName().equals(userId.toString())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Address> addresses = addressService.getAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    // ✅ Add a single address for a user
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping
    public ResponseEntity<Map<String, Object>> addAddress(@PathVariable UUID userId, @RequestBody Address address, Authentication auth) {
        if (!auth.getName().equals(userId.toString())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        addressService.addAddress(userId, address);
        return ResponseEntity.ok(Map.of("status", "created"));
    }
}
