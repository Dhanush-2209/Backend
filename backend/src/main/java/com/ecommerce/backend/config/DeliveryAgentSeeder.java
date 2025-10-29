package com.ecommerce.backend.config;

import com.ecommerce.backend.entity.DeliveryAgent;
import com.ecommerce.backend.repository.DeliveryAgentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DeliveryAgentSeeder {

    @Bean
    public CommandLineRunner seedDeliveryAgents(DeliveryAgentRepository agentRepository) {
        return args -> {
            if (agentRepository.count() == 0) {
                List<DeliveryAgent> agents = List.of(
                    create("Rajesh Kumar", "9876543210"),
                    create("Priya Sharma", "9876543211"),
                    create("Amit Verma", "9876543212"),
                    create("Sneha Reddy", "9876543213"),
                    create("Vikram Singh", "9876543214"),
                    create("Neha Joshi", "9876543215"),
                    create("Arjun Mehta", "9876543216"),
                    create("Kavita Nair", "9876543217"),
                    create("Ravi Patel", "9876543218"),
                    create("Divya Kapoor", "9876543219")
                );
                agentRepository.saveAll(agents);
                System.out.println("✅ Seeded 10 delivery agents.");
            }
        };
    }

    private DeliveryAgent create(String name, String phone) {
        DeliveryAgent agent = new DeliveryAgent();
        agent.setName(name);
        agent.setPhone(phone);
        return agent;
    }
}
