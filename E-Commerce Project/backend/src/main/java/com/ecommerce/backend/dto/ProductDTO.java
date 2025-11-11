package com.ecommerce.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // lombok: automatically generates getters, setters, toString, equals, and hashCode methods
@NoArgsConstructor // lombok: generates a constructor with no arguments
@AllArgsConstructor // lombok: generates a constructor with all arguments
@SuppressWarnings("null")
public class ProductDTO {

    private Long id; // product id (useful for returning existing products)

    @NotBlank(message = "product title cannot be empty")
    private String title; // title of the product

    @NotBlank(message = "product description cannot be empty")
    private String description; // detailed description of the product

    @NotNull(message = "product price cannot be null") // validation: ensures the price is not null
    @Min(value = 0, message = "product price must be non-negative") // validation: ensures price is not negative
    private Double price; // price of the product

    @NotBlank(message = "product category cannot be empty")
    private String category; // category of the product (e.g., "men's clothing", "electronics")

    private String image; // URL for the product image

    private RatingDTO rating; // rating object with rate and count

    // Backward compatibility getters/setters
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