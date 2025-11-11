package com.ecommerce.backend.config;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductDataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;

    public ProductDataLoader(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        if (productRepository.count() == 0) {
            Product product1 = new Product();
            product1.setTitle("Hair dryer");
            product1.setDescription("Best hair dryer for all types of hairs....");
            product1.setPrice(5000.0);
            product1.setCategory("Electronics");
            product1.setImage("https://havells.com/media/catalog/product/cache/844a913d283fe95e56e39582c5f2767b/g/h/ghpddabepp10_5_.jpg");
            product1.setRatingRate(3.9);
            product1.setRatingCount(120);
            
            Product product2 = new Product();
            product2.setTitle("iPhone 14 Pro");
            product2.setDescription("Latest Apple smartphone with A16 Bionic chip...");
            product2.setPrice(100000.0);
            product2.setCategory("Electronics");
            product2.setImage("https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400");
            product2.setRatingRate(4.5);
            product2.setRatingCount(580);
            
            Product product3 = new Product();
            product3.setTitle("Samsung Galaxy S23");
            product3.setDescription("Flagship Android phone with amazing camera");
            product3.setPrice(80000.0);
            product3.setCategory("Electronics");
            product3.setImage("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400");
            product3.setRatingRate(4.0);
            product3.setRatingCount(270);
            
            Product product4 = new Product();
            product4.setTitle("Nike Air Max 270");
            product4.setDescription("Comfortable running shoes for daily wear");
            product4.setPrice(80000.0);
            product4.setCategory("Footwear");
            product4.setImage("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400");
            product4.setRatingRate(4.2);
            product4.setRatingCount(240);
            
            Product product5 = new Product();
            product5.setTitle("MacBook Air M2");
            product5.setDescription("Lightweight laptop for professionals");
            product5.setPrice(150000.0);
            product5.setCategory("Electronincs");
            product5.setImage("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400");
            product5.setRatingRate(4.4);
            product5.setRatingCount(870);
            
            List<Product> products = List.of(product1, product2, product3, product4, product5);

            productRepository.saveAll(products);
            System.out.println("✅ Inserted " + products.size() + " products into database.");
        }
    }
}