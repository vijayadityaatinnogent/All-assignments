package com.ecommerce.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // this annotation marks this class as a JPA entity, mapping it to a database table
@Table(name = "products") // specifies the actual table name in the database
@Data // lombok: automatically generates getters, setters, toString, equals, and hashCode methods
@NoArgsConstructor // lombok: generates a constructor with no arguments
@AllArgsConstructor // lombok: generates a constructor with all arguments
public class Product {

    @Id // marks the field as the primary key of the entity
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_seq")
    @SequenceGenerator(name = "product_seq", sequenceName = "product_sequence", allocationSize = 1)
    private Long id; // unique identifier for the product

    @Column(nullable = false, length = 500) // product title
    private String title; // title of the product

    @Column(length = 1000) // allows for a longer description field
    private String description; // detailed description of the product

    @Column(nullable = false)
    private Double price; // price of the product

    @Column(nullable = false)
    private String category; // category of the product (e.g., "men's clothing", "electronics")

    @Column(length = 1000)
    private String image; // URL for the product image

    @Column(name = "rating_rate")
    private Double ratingRate;

    @Column(name = "rating_count")
    private Integer ratingCount;

    // Backward compatibility - keep name field for existing code
    public String getName() {
        return this.title;
    }

    public void setName(String name) {
        this.title = name;
    }

    public String getImageUrl() {
        return this.image;
    }

    public void setImageUrl(String imageUrl) {
        this.image = imageUrl;
    }
}