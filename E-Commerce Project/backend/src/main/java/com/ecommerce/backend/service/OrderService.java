package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.*;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.PromoCode;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.PromoCodeRepository;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.concurrent.CompletableFuture;
import java.util.ArrayList;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final PromoCodeService promoCodeService;
    private final PromoCodeRepository promoCodeRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, 
                       PromoCodeService promoCodeService, PromoCodeRepository promoCodeRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.promoCodeService = promoCodeService;
        this.promoCodeRepository = promoCodeRepository;
    }

    private OrderDTO convertToDto(Order order) {
        List<OrderItemDTO> orderItemDTOs = order.getOrderItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getImageUrl(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getTotalPrice()
                ))
                .collect(Collectors.toList());

        return new OrderDTO(
                order.getId(),
                order.getAddressLine1(),
                order.getState(),
                order.getPincode(),
                null, // cartItems not needed in response
                order.getOriginalPrice(),
                order.getPromoCode() != null ? order.getPromoCode().getCode() : null,
                order.getDiscountAmount(),
                order.getFinalPrice(),
                order.getStatus(),
                order.getOrderDate(),
                order.getDeliveryDate(),
                orderItemDTOs
        );
    }

    public OrderDTO createOrder(OrderDTO orderDTO) {
        // Create new order
        Order order = new Order();
        order.setAddressLine1(orderDTO.getAddressLine1());
        order.setState(orderDTO.getState());
        order.setPincode(orderDTO.getPincode());
        order.setOriginalPrice(orderDTO.getOriginalPrice());
        
        // Handle promo code
        PromoCode promoCode = null;
        Double discountAmount = 0.0;
        if (orderDTO.getPromoCode() != null && !orderDTO.getPromoCode().trim().isEmpty()) {
            promoCode = promoCodeService.validatePromoCode(orderDTO.getPromoCode());
            discountAmount = promoCodeService.calculateDiscount(orderDTO.getPromoCode(), orderDTO.getOriginalPrice());
        }
        order.setPromoCode(promoCode);
        order.setDiscountAmount(discountAmount);
        order.setFinalPrice(orderDTO.getOriginalPrice() - discountAmount);
        
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());

        // Create order items
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItemDTO cartItem : orderDTO.getCartItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + cartItem.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setTotalPrice(cartItem.getPrice() * cartItem.getQuantity());
            
            orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);

        // Save order
        Order savedOrder = orderRepository.save(order);
        
        // Auto delivery will be handled by scheduled task
        
        return convertToDto(savedOrder);
    }
    


    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return convertToDto(order);
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public OrderDTO updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        
        order.setStatus(status);
        if ("DELIVERED".equals(status)) {
            order.setDeliveryDate(LocalDateTime.now());
        }
        Order updatedOrder = orderRepository.save(order);
        return convertToDto(updatedOrder);
    }

    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }
    
    // Cancel order functionality
    public OrderDTO cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        
        if ("DELIVERED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel delivered order");
        }
        
        order.setStatus("CANCELLED");
        Order updatedOrder = orderRepository.save(order);
        return convertToDto(updatedOrder);
    }
    
    // Progressive status updates every 2 hours: PENDING → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
    @Scheduled(fixedRate = 60000) // Check every 60 seconds
    // @Scheduled(fixedRate = 2000) // Check every 60 seconds
    public void updateOrderStatuses() {
        LocalDateTime now = LocalDateTime.now();
        
        // PENDING → SHIPPED (after 2 hours)
        LocalDateTime twoHoursAgo = now.minusHours(2);
        // LocalDateTime twoHoursAgo = now.minusSeconds(20);
        List<Order> pendingOrders = orderRepository.findByStatusAndOrderDateBefore("PENDING", twoHoursAgo);
        for (Order order : pendingOrders) {
            order.setStatus("SHIPPED");
            orderRepository.save(order);
            System.out.println("Order " + order.getId() + " moved to SHIPPED");
        }
        
        // SHIPPED → OUT_FOR_DELIVERY (after 4 hours total)
        LocalDateTime fourHoursAgo = now.minusHours(4);
        // LocalDateTime fourHoursAgo = now.minusSeconds(30);
        List<Order> shippedOrders = orderRepository.findByStatusAndOrderDateBefore("SHIPPED", fourHoursAgo);
        for (Order order : shippedOrders) {
            order.setStatus("OUT_FOR_DELIVERY");
            orderRepository.save(order);
            System.out.println("Order " + order.getId() + " moved to OUT_FOR_DELIVERY");
        }
        
        // OUT_FOR_DELIVERY → DELIVERED (after 6 hours total)
        LocalDateTime sixHoursAgo = now.minusHours(6);
        // LocalDateTime sixHoursAgo = now.minusSeconds(40);
        List<Order> outForDeliveryOrders = orderRepository.findByStatusAndOrderDateBefore("OUT_FOR_DELIVERY", sixHoursAgo);
        for (Order order : outForDeliveryOrders) {
            order.setStatus("DELIVERED");
            order.setDeliveryDate(LocalDateTime.now());
            orderRepository.save(order);
            System.out.println("Order " + order.getId() + " moved to DELIVERED");
        }
    }
}