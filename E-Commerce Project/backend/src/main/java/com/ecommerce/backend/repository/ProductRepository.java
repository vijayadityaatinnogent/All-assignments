package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository // indicates that this interface is a "repository" component
public interface ProductRepository extends JpaRepository<Product, Long> {

    // custom method to find products by category
    List<Product> findByCategory(String category);

    // you can add more custom queries here if needed
    // for example: List<Product> findByNameContainingIgnoreCase(String name);
}