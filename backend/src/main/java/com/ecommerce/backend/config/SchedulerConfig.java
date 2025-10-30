package com.ecommerce.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling // ✅ Enables @Scheduled tasks across the app
public class SchedulerConfig {
}
