package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.OrderDTO;
import com.ecommerce.backend.dto.ItemDTO;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.Item;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.DeliveryAgent;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.repository.DeliveryAgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeliveryAgentRepository deliveryAgentRepository;

    // ✅ Save new order with random delivery agent
    public Order saveOrder(OrderDTO dto) {
        Optional<User> userOpt = userRepository.findById(dto.getUserId());
        if (userOpt.isEmpty()) return null;

        User user = userOpt.get();

        Order order = new Order();
        order.setUser(user);
        order.setSubtotal(dto.getSubtotal());
        order.setShipping(dto.getShipping());
        order.setTax(dto.getTax());
        order.setTotal(dto.getTotal());
        order.setAddress(dto.getAddress());
        order.setDeliveryDate(dto.getDeliveryDate());
        order.setOrderedDate(dto.getOrderedDate());
        order.setOrderedDay(dto.getOrderedDay());
        order.setOrderedTime(dto.getOrderedTime());
        order.setStatus(dto.getStatus());
        order.setPaymentMethod(dto.getPaymentMethod());

        // ✅ Assign random delivery agent
        List<DeliveryAgent> agents = deliveryAgentRepository.findAll();
        if (!agents.isEmpty()) {
            DeliveryAgent assignedAgent = agents.get(new Random().nextInt(agents.size()));
            order.setDeliveryAgent(assignedAgent);
        }

        List<Item> items = new ArrayList<>();
        for (ItemDTO itemDTO : dto.getItems()) {
            Item item = new Item();
            item.setProductId(itemDTO.getProductId());
            item.setName(itemDTO.getName());
            item.setPrice(itemDTO.getPrice());
            item.setQty(itemDTO.getQty());
            item.setUnit(itemDTO.getUnit());
            item.setBrand(itemDTO.getBrand());
            item.setCategory(itemDTO.getCategory());
            item.setSku(itemDTO.getSku());
            item.setDescription(itemDTO.getDescription());
            item.setImage(itemDTO.getImage());
            item.setOrder(order);
            items.add(item);
        }

        order.setItems(items);
        return orderRepository.save(order);
    }

    // ✅ Convert Order to DTO with agent and user info
    public OrderDTO mapToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setUserName(order.getUser().getUsername()); // ✅ Added
        dto.setUserEmail(order.getUser().getEmail());   // ✅ Added
        dto.setSubtotal(order.getSubtotal());
        dto.setShipping(order.getShipping());
        dto.setTax(order.getTax());
        dto.setTotal(order.getTotal());
        dto.setAddress(order.getAddress());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setOrderedDate(order.getOrderedDate());
        dto.setOrderedDay(order.getOrderedDay());
        dto.setOrderedTime(order.getOrderedTime());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());

        // ✅ Include delivery agent details
        if (order.getDeliveryAgent() != null) {
            dto.setAgentName(order.getDeliveryAgent().getName());
            dto.setAgentPhone(order.getDeliveryAgent().getPhone());
        }

        List<ItemDTO> itemDTOs = new ArrayList<>();
        for (Item item : order.getItems()) {
            ItemDTO i = new ItemDTO();
            i.setProductId(item.getProductId());
            i.setName(item.getName());
            i.setPrice(item.getPrice());
            i.setQty(item.getQty());
            i.setUnit(item.getUnit());
            i.setBrand(item.getBrand());
            i.setCategory(item.getCategory());
            i.setSku(item.getSku());
            i.setDescription(item.getDescription());
            i.setImage(item.getImage());
            itemDTOs.add(i);
        }

        dto.setItems(itemDTOs);
        return dto;
    }

    // ✅ Cancel order
    public Order cancelOrder(Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) return null;

        Order order = orderOpt.get();
        order.setStatus("Cancelled");
        return orderRepository.save(order);
    }

    // ✅ Reorder items
    public List<ItemDTO> reorderOrder(Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) return Collections.emptyList();

        Order order = orderOpt.get();
        List<ItemDTO> reorderedItems = new ArrayList<>();

        for (Item item : order.getItems()) {
            ItemDTO dto = new ItemDTO();
            dto.setProductId(item.getProductId());
            dto.setName(item.getName());
            dto.setPrice(item.getPrice());
            dto.setQty(item.getQty());
            dto.setUnit(item.getUnit());
            dto.setBrand(item.getBrand());
            dto.setCategory(item.getCategory());
            dto.setSku(item.getSku());
            dto.setDescription(item.getDescription());
            dto.setImage(item.getImage());
            reorderedItems.add(dto);
        }

        return reorderedItems;
    }
}
