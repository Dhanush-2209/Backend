package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.UserSummaryDTO;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.service.UserService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Register new user
    @PostMapping
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }

        if (userService.emailExists(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        if (userService.usernameExists(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already taken");
        }

        User savedUser = userService.register(user);
        return ResponseEntity.ok(savedUser);
    }

    // ✅ Public check: email exists
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.emailExists(email));
    }

    // ✅ Public check: username exists
    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        return ResponseEntity.ok(userService.usernameExists(username));
    }

    // ✅ Admin summary endpoint (JWT protected)
    @GetMapping("/admin")
    public ResponseEntity<List<UserSummaryDTO>> getAllUserSummaries(HttpServletRequest request) {
        Claims claims = (Claims) request.getAttribute("claims");
        return ResponseEntity.ok(userService.getUserSummaries());
    }

    // ✅ NEW: General GET /api/users for dashboard and admin use
    @GetMapping
    public ResponseEntity<List<UserSummaryDTO>> getAllUsers(HttpServletRequest request) {
        Claims claims = (Claims) request.getAttribute("claims"); // Optional: enforce JWT if needed
        return ResponseEntity.ok(userService.getUserSummaries());
    }
}
