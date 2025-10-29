package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.OrderDTO;
import com.ecommerce.backend.dto.ItemDTO;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.service.OrderService;
import com.ecommerce.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    // ✅ Place a new order
    @PostMapping
    public ResponseEntity<Long> placeOrder(@RequestBody OrderDTO dto) {
        Order savedOrder = orderService.saveOrder(dto);
        if (savedOrder == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(savedOrder.getId());
    }

    // ✅ Fetch order by ID (used in confirmation, details, tracking)
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        OrderDTO dto = orderService.mapToDTO(orderOpt.get());
        return ResponseEntity.ok(dto);
    }

    // ✅ Fetch all orders for a user (used in Orders.jsx)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByUser(@PathVariable UUID userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        List<OrderDTO> dtos = orders.stream()
                .map(orderService::mapToDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    // ✅ Fetch all orders (used in AdminOrders.jsx)
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderDTO> dtos = orders.stream()
                .map(orderService::mapToDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    // ✅ Cancel an order
    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(@PathVariable Long orderId) {
        Order cancelled = orderService.cancelOrder(orderId);
        if (cancelled == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(orderService.mapToDTO(cancelled));
    }

    // ✅ Reorder items from an order
    @PostMapping("/{orderId}/reorder")
    public ResponseEntity<List<ItemDTO>> reorderItems(@PathVariable Long orderId) {
        List<ItemDTO> items = orderService.reorderOrder(orderId);
        if (items.isEmpty()) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(items);
    }
}
