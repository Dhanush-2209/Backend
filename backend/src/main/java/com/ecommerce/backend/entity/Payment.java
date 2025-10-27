package com.ecommerce.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // Prevent circular reference
    private User user;

    @Column(nullable = false)
    private String cardType; // e.g., Visa, MasterCard

    @Column(nullable = false)
    private String cardName; // Cardholder name

    @Column(nullable = false)
    private String cardMasked; // **** **** **** 1234

    @Column(nullable = false)
    private String cardLast4; // Last 4 digits

    @Column(nullable = false)
    private String expiry; // MM/YY

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCardType() { return cardType; }
    public void setCardType(String cardType) { this.cardType = cardType; }

    public String getCardName() { return cardName; }
    public void setCardName(String cardName) { this.cardName = cardName; }

    public String getCardMasked() { return cardMasked; }
    public void setCardMasked(String cardMasked) { this.cardMasked = cardMasked; }

    public String getCardLast4() { return cardLast4; }
    public void setCardLast4(String cardLast4) { this.cardLast4 = cardLast4; }

    public String getExpiry() { return expiry; }
    public void setExpiry(String expiry) { this.expiry = expiry; }
}
