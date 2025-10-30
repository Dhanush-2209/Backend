package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductDTO;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Value("${product.image.base-url}")
    private String baseImageUrl;

    public List<ProductDTO> getAllAsDTO() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getByCategory(String category) {
        if (category == null || category.equalsIgnoreCase("All")) {
            return getAllAsDTO();
        }
        return productRepository.findByCategoryIgnoreCase(category)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getDeals() {
        return productRepository.findByDiscountPercentageGreaterThanEqual(15.0)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> filterProducts(
            String search,
            List<String> brands,
            List<String> categories,
            Double priceMin,
            Double priceMax,
            Double ratingMin,
            String sort,
            int page,
            int limit
    ) {
        List<Product> all = productRepository.findAll();

        List<Product> filtered = all.stream()
                .filter(p -> search == null || p.getTitle().toLowerCase().contains(search.toLowerCase()))
                .filter(p -> brands == null || brands.isEmpty() || brands.contains(p.getBrand()))
                .filter(p -> categories == null || categories.isEmpty() || categories.contains(p.getCategory()))
                .filter(p -> priceMin == null || p.getPrice() >= priceMin)
                .filter(p -> priceMax == null || p.getPrice() <= priceMax)
                .filter(p -> ratingMin == null || p.getRating() >= ratingMin)
                .sorted((a, b) -> {
                    if ("price-asc".equals(sort)) return Double.compare(a.getPrice(), b.getPrice());
                    if ("price-desc".equals(sort)) return Double.compare(b.getPrice(), a.getPrice());
                    if ("rating".equals(sort)) return Double.compare(b.getRating(), a.getRating());
                    return 0;
                })
                .skip((long) (page - 1) * limit)
                .limit(limit)
                .collect(Collectors.toList());

        return filtered.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public void delete(String id) {
        productRepository.deleteById(id);
    }

    public Optional<Product> getById(String id) {
        return productRepository.findById(id);
    }

    public ProductDTO convertToDTO(Product product) {
        if (product == null) return null;

        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setCategory(product.getCategory());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setRating(product.getRating());
        dto.setBrand(product.getBrand());
        dto.setDiscountPercentage(product.getDiscountPercentage());

        String thumbnail = product.getThumbnail();
        dto.setThumbnail(thumbnail != null && !thumbnail.isBlank()
                ? (thumbnail.startsWith("http") ? thumbnail : baseImageUrl + thumbnail)
                : null);

        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }

    // ✅ NEW: Decrement stock by quantity
    public Product decrementStock(String productId, int decrementBy) {
        Optional<Product> optionalProduct = getById(productId);
        if (optionalProduct.isEmpty()) {
            throw new IllegalArgumentException("Product not found");
        }

        Product product = optionalProduct.get();
        int newStock = Math.max(0, product.getStock() - decrementBy);
        product.setStock(newStock);
        return save(product);
    }
}
