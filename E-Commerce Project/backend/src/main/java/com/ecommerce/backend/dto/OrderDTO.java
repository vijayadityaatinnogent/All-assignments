package com.ecommerce.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    private Long id;

    // Address fields
    @NotBlank(message = "Address line 1 cannot be empty")
    private String addressLine1;

    @NotBlank(message = "State cannot be empty")
    private String state;

    @NotBlank(message = "Pincode cannot be empty")
    private String pincode;

    // Cart items for order creation
    private List<CartItemDTO> cartItems;

    @NotNull(message = "Original price cannot be null")
    @Min(value = 0, message = "Original price must be non-negative")
    private Double originalPrice;

    private String promoCode;
    private Double discountAmount;
    private Double finalPrice;
    private String status;
    private LocalDateTime orderDate;
    private LocalDateTime deliveryDate;
    
    // Order items for response
    private List<OrderItemDTO> orderItems;
}