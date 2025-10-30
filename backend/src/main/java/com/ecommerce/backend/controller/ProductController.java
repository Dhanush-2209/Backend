package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ProductDTO;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.service.FileService;
import com.ecommerce.backend.service.ProductService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private FileService fileService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getProducts(
            @RequestParam(required = false) String category,
            HttpServletRequest request) {
        Claims claims = (Claims) request.getAttribute("claims");
        List<ProductDTO> products = productService.getByCategory(category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/deals")
    public ResponseEntity<List<ProductDTO>> getDealProducts(HttpServletRequest request) {
        Claims claims = (Claims) request.getAttribute("claims");
        List<ProductDTO> deals = productService.getDeals();
        return ResponseEntity.ok(deals);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ProductDTO>> filterProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> brands,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) Double priceMin,
            @RequestParam(required = false) Double priceMax,
            @RequestParam(required = false) Double ratingMin,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int limit
    ) {
        List<ProductDTO> filtered = productService.filterProducts(
                search, brands, categories, priceMin, priceMax, ratingMin, sort, page, limit
        );
        return ResponseEntity.ok(filtered);
    }

    @PostMapping
    public ResponseEntity<?> createProduct(HttpServletRequest request,
                                           @RequestParam("title") String title,
                                           @RequestParam("description") String description,
                                           @RequestParam("category") String category,
                                           @RequestParam("price") double price,
                                           @RequestParam("stock") int stock,
                                           @RequestParam("rating") double rating,
                                           @RequestParam("brand") String brand,
                                           @RequestParam(value = "discountPercentage", required = false, defaultValue = "0") double discountPercentage,
                                           @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail) {
        try {
            Claims claims = (Claims) request.getAttribute("claims");

            String imagePath = thumbnail != null ? fileService.save(thumbnail) : null;

            Product product = new Product();
            product.setTitle(title);
            product.setDescription(description);
            product.setCategory(category);
            product.setPrice(price);
            product.setStock(stock);
            product.setRating(rating);
            product.setBrand(brand);
            product.setDiscountPercentage(discountPercentage);
            product.setThumbnail(imagePath);

            return ResponseEntity.ok(productService.save(product));
        } catch (IOException e) {
            System.err.println("File upload failed: " + e.getMessage());
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(HttpServletRequest request,
                                           @PathVariable String id) {
        Claims claims = (Claims) request.getAttribute("claims");

        Optional<Product> optionalProduct = productService.getById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product product = optionalProduct.get();
        String thumbnailName = product.getThumbnail();

        if (thumbnailName != null && !thumbnailName.isBlank()) {
            Path imagePath = Paths.get("uploads").resolve(thumbnailName).toAbsolutePath();
            try {
                Files.deleteIfExists(imagePath);
                System.out.println("🗑️ Deleted image: " + imagePath);
            } catch (IOException e) {
                System.err.println("⚠️ Failed to delete image: " + imagePath);
            }
        }

        productService.delete(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateProductField(HttpServletRequest request,
                                                @PathVariable String id,
                                                @RequestBody Map<String, Object> updates) {
        Claims claims = (Claims) request.getAttribute("claims");

        Optional<Product> optionalProduct = productService.getById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }

        Product product = optionalProduct.get();

        updates.forEach((field, value) -> {
            switch (field) {
                case "price" -> product.setPrice(Double.parseDouble(value.toString()));
                case "stock" -> product.setStock(Integer.parseInt(value.toString()));
                case "title" -> product.setTitle(value.toString());
                case "rating" -> product.setRating(Double.parseDouble(value.toString()));
                case "brand" -> product.setBrand(value.toString());
                case "category" -> product.setCategory(value.toString());
                case "description" -> product.setDescription(value.toString());
                case "discountPercentage" -> product.setDiscountPercentage(Double.parseDouble(value.toString()));
            }
        });

        Product updated = productService.save(product);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/decrement")
    public ResponseEntity<?> decrementStock(@PathVariable String id,
                                            @RequestBody Map<String, Integer> body) {
        Integer decrementBy = body.get("decrementBy");
        if (decrementBy == null || decrementBy < 1) {
            return ResponseEntity.badRequest().body("Invalid decrement value");
        }

        Optional<Product> optionalProduct = productService.getById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }

        Product product = optionalProduct.get();
        int newStock = Math.max(0, product.getStock() - decrementBy);
        product.setStock(newStock);
        Product updated = productService.save(product);

        return ResponseEntity.ok(updated);
    }
}
