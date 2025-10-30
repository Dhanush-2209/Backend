package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.PaymentDTO;
import com.ecommerce.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users/{userId}/cards")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // ✅ Get all saved cards for a user
    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getUserCards(@PathVariable UUID userId) {
        List<PaymentDTO> cards = paymentService.getCardsByUserId(userId);
        return ResponseEntity.ok(cards);
    }

    // ✅ Save a new card
    @PostMapping
    public ResponseEntity<List<PaymentDTO>> saveCard(
            @PathVariable UUID userId,
            @RequestBody PaymentDTO cardDTO
    ) {
        List<PaymentDTO> updatedCards = paymentService.saveCard(userId, cardDTO);
        return ResponseEntity.ok(updatedCards);
    }

    // ✅ Update an existing card
    @PutMapping("/{cardId}")
    public ResponseEntity<List<PaymentDTO>> updateCard(
            @PathVariable UUID userId,
            @PathVariable UUID cardId,
            @RequestBody PaymentDTO cardDTO
    ) {
        List<PaymentDTO> updatedCards = paymentService.updateCard(userId, cardId, cardDTO);
        return ResponseEntity.ok(updatedCards);
    }

    // ✅ Delete a card
    @DeleteMapping("/{cardId}")
    public ResponseEntity<List<PaymentDTO>> deleteCard(
            @PathVariable UUID userId,
            @PathVariable UUID cardId
    ) {
        List<PaymentDTO> updatedCards = paymentService.deleteCard(userId, cardId);
        return ResponseEntity.ok(updatedCards);
    }
}
