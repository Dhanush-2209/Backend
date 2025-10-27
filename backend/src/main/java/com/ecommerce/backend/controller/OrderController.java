package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.OrderDTO;
import com.ecommerce.backend.dto.ItemDTO;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.Item;
import com.ecommerce.backend.service.OrderService;
import com.ecommerce.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.stream.Collectors;

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

    // ✅ Fetch order by ID (used in confirmation page)
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        OrderDTO dto = new OrderDTO();

        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setAddress(order.getAddress());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setOrderedDate(order.getOrderedDate());
        dto.setOrderedDay(order.getOrderedDay());
        dto.setOrderedTime(order.getOrderedTime());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setStatus(order.getStatus());
        dto.setSubtotal(order.getSubtotal());
        dto.setTax(order.getTax());
        dto.setShipping(order.getShipping());
        dto.setTotal(order.getTotal());

        dto.setItems(order.getItems().stream().map(item -> {
            ItemDTO i = new ItemDTO();
            i.setName(item.getName());
            i.setPrice(item.getPrice());
            i.setQty(item.getQty());
            return i;
        }).collect(Collectors.toList()));

        return ResponseEntity.ok(dto);
    }
}
