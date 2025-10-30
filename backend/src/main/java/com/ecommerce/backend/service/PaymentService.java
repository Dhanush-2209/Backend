package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.PaymentDTO;
import com.ecommerce.backend.entity.Payment;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.PaymentRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PaymentDTO> getCardsByUserId(UUID userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return Collections.emptyList();

        List<Payment> cards = paymentRepository.findByUser(userOpt.get());
        return cards.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<PaymentDTO> saveCard(UUID userId, PaymentDTO dto) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return Collections.emptyList();

        User user = userOpt.get();

        String cardNumber = dto.getCardNumber();
        if (cardNumber == null || cardNumber.length() != 16) return Collections.emptyList();

        String last4 = cardNumber.substring(12);
        String masked = "**** **** **** " + last4;

        Payment card = new Payment();
        card.setUser(user);
        card.setCardType(dto.getCardType());
        card.setCardName(dto.getCardName());
        card.setCardMasked(masked);
        card.setCardLast4(last4);
        card.setExpiry(dto.getExpiry());

        paymentRepository.save(card);

        return getCardsByUserId(userId);
    }

    public List<PaymentDTO> updateCard(UUID userId, UUID cardId, PaymentDTO dto) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Payment> cardOpt = paymentRepository.findById(cardId);

        if (userOpt.isEmpty() || cardOpt.isEmpty()) return Collections.emptyList();

        Payment card = cardOpt.get();
        if (!card.getUser().getId().equals(userId)) return Collections.emptyList();

        card.setCardType(dto.getCardType());
        card.setCardName(dto.getCardName());
        card.setExpiry(dto.getExpiry());

        String cardNumber = dto.getCardNumber();
        if (cardNumber != null && cardNumber.length() == 16) {
            String last4 = cardNumber.substring(12);
            card.setCardLast4(last4);
            card.setCardMasked("**** **** **** " + last4);
        }

        paymentRepository.save(card);
        return getCardsByUserId(userId);
    }

    public List<PaymentDTO> deleteCard(UUID userId, UUID cardId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Payment> cardOpt = paymentRepository.findById(cardId);

        if (userOpt.isEmpty() || cardOpt.isEmpty()) return Collections.emptyList();

        Payment card = cardOpt.get();
        if (!card.getUser().getId().equals(userId)) return Collections.emptyList();

        paymentRepository.delete(card);
        return getCardsByUserId(userId);
    }

    private PaymentDTO toDTO(Payment card) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(card.getId());
        dto.setCardType(card.getCardType());
        dto.setCardName(card.getCardName());
        dto.setCardMasked(card.getCardMasked());
        dto.setCardLast4(card.getCardLast4());
        dto.setExpiry(card.getExpiry());
        return dto;
    }
}
