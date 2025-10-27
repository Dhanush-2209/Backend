package com.ecommerce.backend.dto;

import java.util.UUID;

public class PaymentDTO {

    private UUID id;
    private String cardType;
    private String cardName;
    private String cardMasked;
    private String cardLast4;
    private String expiry;

    // ✅ Added to accept full card number from frontend
    private String cardNumber;

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

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

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }
}
