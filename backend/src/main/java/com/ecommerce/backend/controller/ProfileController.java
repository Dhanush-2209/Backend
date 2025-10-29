package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ProfileDTO;
import com.ecommerce.backend.service.ProfileService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    // ✅ Get full profile for logged-in user
    @GetMapping
    public ResponseEntity<ProfileDTO> getProfile(HttpServletRequest request) {
        UUID userId = extractUserIdFromJWT(request);
        ProfileDTO profile = profileService.getProfile(userId);
        return ResponseEntity.ok(profile);
    }

    // ✅ Update profile (user info + addresses + cards)
    @PatchMapping("/update")
    public ResponseEntity<String> updateProfile(@RequestBody ProfileDTO dto, HttpServletRequest request) {
        UUID userId = extractUserIdFromJWT(request);
        profileService.updateProfile(userId, dto);
        return ResponseEntity.ok("Profile updated successfully");
    }

    // ✅ Check if email is taken (excluding current user)
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email, @RequestParam UUID exclude) {
        boolean taken = profileService.isEmailTaken(email, exclude);
        return ResponseEntity.ok(taken);
    }

    // ✅ Extract user ID from JWT claims
    private UUID extractUserIdFromJWT(HttpServletRequest request) {
        Claims claims = (Claims) request.getAttribute("claims");
        return UUID.fromString(claims.getSubject());
    }
}
