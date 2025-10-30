package com.ecommerce.backend.scheduler;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class OrderStatusScheduler {

    @Autowired
    private OrderRepository orderRepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    @Scheduled(fixedRate = 5 * 60 * 1000) // ✅ Runs every 5 minutes
    @Transactional
    public void updateOrderStatuses() {
        List<Order> orders = orderRepository.findAll();
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Kolkata")); // ✅ Use IST for comparison

        for (Order order : orders) {
            if ("Cancelled".equals(order.getStatus())) continue;

            try {
                // ✅ Parse orderedTime as UTC and convert to IST
                ZonedDateTime placedUtc = ZonedDateTime.parse(order.getOrderedTime(), formatter.withZone(ZoneOffset.UTC));
                LocalDateTime placed = placedUtc.withZoneSameInstant(ZoneId.of("Asia/Kolkata")).toLocalDateTime();

                // ✅ Parse deliveryDate as local date
                LocalDate delivery = LocalDate.parse(order.getDeliveryDate());

                long seconds = Duration.between(placed, now).getSeconds();

                String newStatus = order.getStatus();

                if (now.toLocalDate().equals(delivery)) {
                    newStatus = "Delivered";
                } else if (seconds >= 3600) {
                    newStatus = "Out for Delivery";
                } else if (seconds >= 1800) {
                    newStatus = "Shipped";
                } else {
                    newStatus = "Ordered";
                }

                order.setStatus(newStatus);
            } catch (Exception e) {
                System.err.println("⚠️ Failed to parse dates for order ID " + order.getId());
            }
        }

        orderRepository.saveAll(orders);
        System.out.println("✅ Order statuses updated by scheduler.");
    }
}
