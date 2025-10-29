package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.*;
import com.ecommerce.backend.entity.*;
import com.ecommerce.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProfileService {

    @Autowired private UserRepository userRepo;
    @Autowired private AddressRepository addressRepo;
    @Autowired private PaymentRepository paymentRepo;

    public ProfileDTO getProfile(UUID userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        ProfileDTO dto = new ProfileDTO();
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());

        List<AddressDTO> addressDTOs = addressRepo.findByUserId(userId).stream()
            .map(this::mapAddress)
            .toList();
        dto.setAddresses(addressDTOs);

        List<PaymentDTO> paymentDTOs = paymentRepo.findByUser(user).stream()
            .map(this::mapPayment)
            .toList();
        dto.setPayments(paymentDTOs);

        return dto;
    }

    public void updateProfile(UUID userId, ProfileDTO dto) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());

        if (dto.getPassword() != null && dto.getPassword().length() >= 6) {
            user.setPassword(dto.getPassword()); // 🔐 Hash if needed
        }

        userRepo.save(user);

        // Replace addresses
        List<Address> existingAddresses = addressRepo.findByUserId(userId);
        addressRepo.deleteAll(existingAddresses);

        if (dto.getAddresses() != null) {
            for (AddressDTO a : dto.getAddresses()) {
                Address addr = new Address();
                addr.setUser(user);
                addr.setName(a.getName());
                addr.setPhone(a.getPhone());
                addr.setLine(a.getLine());
                addr.setCity(a.getCity());
                addr.setPincode(a.getPincode());
                addressRepo.save(addr);
            }
        }

        // Replace cards
        List<Payment> existingCards = paymentRepo.findByUser(user);
        paymentRepo.deleteAll(existingCards);

        if (dto.getPayments() != null) {
            for (PaymentDTO p : dto.getPayments()) {
                if (p.getCardNumber() == null || p.getCardNumber().length() < 4) continue;

                Payment card = new Payment();
                card.setUser(user);
                card.setCardType(p.getCardType());
                card.setCardName(p.getCardName());
                card.setCardMasked(maskCard(p.getCardNumber()));
                card.setCardLast4(p.getCardNumber().substring(p.getCardNumber().length() - 4));
                card.setExpiry(p.getExpiry());
                paymentRepo.save(card);
            }
        }
    }

    public boolean isEmailTaken(String email, UUID excludeId) {
        return userRepo.findByEmail(email)
            .map(u -> !u.getId().equals(excludeId))
            .orElse(false);
    }

    private AddressDTO mapAddress(Address a) {
        return new AddressDTO(a.getId(), a.getName(), a.getPhone(), a.getLine(), a.getCity(), a.getPincode());
    }

    private PaymentDTO mapPayment(Payment p) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(p.getId());
        dto.setCardType(p.getCardType());
        dto.setCardName(p.getCardName());
        dto.setCardMasked(p.getCardMasked());
        dto.setCardLast4(p.getCardLast4());
        dto.setExpiry(p.getExpiry());
        return dto;
    }

    private String maskCard(String number) {
        String last4 = number.substring(number.length() - 4);
        return "**** **** **** " + last4;
    }
}
