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
    @Autowired private OrderRepository orderRepo;
    @Autowired private WishlistItemRepository wishlistRepo;
    @Autowired private CartItemRepository cartItemRepo;

    public ProfileDTO getProfile(UUID userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        ProfileDTO dto = new ProfileDTO();
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());

        // ✅ Derive role from isAdmin
        dto.setRole(user.isAdmin() ? "Admin" : "Verified User");

        List<AddressDTO> addressDTOs = addressRepo.findByUserId(userId).stream()
                .map(this::mapAddress)
                .toList();
        dto.setAddresses(addressDTOs);

        List<PaymentDTO> paymentDTOs = paymentRepo.findByUser(user).stream()
                .map(this::mapPayment)
                .toList();
        dto.setPayments(paymentDTOs);

        List<OrderDTO> orderDTOs = orderRepo.findByUserId(userId).stream()
                .map(this::mapOrder)
                .toList();
        dto.setOrders(orderDTOs);

        List<WishlistDTO> wishlistDTOs = wishlistRepo.findByUserId(userId).stream()
                .map(this::mapWishlist)
                .toList();
        dto.setWishlist(wishlistDTOs);

        return dto;
    }

    public UserHeaderStatsDTO getHeaderStats(UUID userId) {
        int wishlistCount = wishlistRepo.findByUserId(userId).size();
        int cartCount = cartItemRepo.findByUserId(userId).size();
        User user = userRepo.findById(userId).orElseThrow();
        int savedCardCount = paymentRepo.findByUser(user).size();

        return new UserHeaderStatsDTO(wishlistCount, cartCount, savedCardCount);
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

    private OrderDTO mapOrder(Order o) {
        return new OrderDTO(o.getId(), o.getStatus(), o.getTotal(), o.getOrderedDate());
    }

    private WishlistDTO mapWishlist(WishlistItem w) {
        Product p = w.getProduct();
        WishlistProductDTO productDTO = new WishlistProductDTO(
                p.getId(), p.getTitle(), p.getThumbnail(), p.getDescription(), p.getPrice()
        );
        return new WishlistDTO(w.getId().toString(), productDTO);
    }

    private String maskCard(String number) {
        String last4 = number.substring(number.length() - 4);
        return "**** **** **** " + last4;
    }
}
