package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.UserSummaryDTO;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public boolean usernameExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<UserSummaryDTO> getUserSummaries() {
        List<User> users = userRepository.findAll();
        List<UserSummaryDTO> summaries = new ArrayList<>();

        for (User user : users) {
            UserSummaryDTO dto = new UserSummaryDTO();
            dto.setId(user.getId().toString());
            dto.setName((user.getFirstName() + " " + user.getLastName()).trim());
            dto.setEmail(user.getEmail());

            String city = user.getAddresses() != null && !user.getAddresses().isEmpty()
                    ? user.getAddresses().get(0).getCity()
                    : "";
            dto.setAddress(city);

            int totalItems = 0;
            double totalPrice = 0;
            if (user.getOrders() != null) {
                for (var order : user.getOrders()) {
                    totalItems += order.getItems().stream().mapToInt(item -> item.getQty()).sum();
                    totalPrice += order.getTotal();
                }
            }

            dto.setTotalItems(totalItems);
            dto.setTotalPrice(totalPrice);

            summaries.add(dto);
        }

        return summaries;
    }
}
