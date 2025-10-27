package com.ecommerce.backend.config;

import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            boolean adminExists = userRepository.existsByIsAdminTrue();
            if (!adminExists) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@ecommerce.com");
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setPhone("9999999999");
                admin.setAdmin(true);
                admin.setPassword(passwordEncoder.encode("Admin@123"));

                userRepository.save(admin);
                System.out.println("Default admin user created.");
            }
        };
    }
}
