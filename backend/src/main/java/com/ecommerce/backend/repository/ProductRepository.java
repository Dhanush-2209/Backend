package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByCategoryIgnoreCase(String category);

    // ✅ NEW METHOD for Deal of the Day
    List<Product> findByDiscountPercentageGreaterThanEqual(double discountThreshold);
}
