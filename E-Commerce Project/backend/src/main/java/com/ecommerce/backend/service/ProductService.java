package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductDTO;
import com.ecommerce.backend.dto.RatingDTO;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service // indicates that this class is a "service" component
public class ProductService {

    private final ProductRepository productRepository;

    // constructor injection: spring automatically injects ProductRepository
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // method to convert product entity to product dto
    private ProductDTO convertToDto(Product product) {
        RatingDTO ratingDTO = null;
        if (product.getRatingRate() != null && product.getRatingCount() != null) {
            ratingDTO = new RatingDTO(product.getRatingRate(), product.getRatingCount());
        }
        
        return new ProductDTO(
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory(),
                product.getImage(),
                ratingDTO
        );
    }

    // method to convert product dto to product entity
    private Product convertToEntity(ProductDTO productDTO) {
        Product product = new Product();
        product.setId(productDTO.getId()); // id might be present for updates
        product.setTitle(productDTO.getTitle());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setCategory(productDTO.getCategory());
        product.setImage(productDTO.getImage());
        
        if (productDTO.getRating() != null) {
            product.setRatingRate(productDTO.getRating().getRate());
            product.setRatingCount(productDTO.getRating().getCount());
        }
        
        return product;
    }

    // creates a new product in the database
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO);
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    // retrieves a product by its ID
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("product not found with id: " + id));
        return convertToDto(product);
    }

    // retrieves all products
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDto) // map each entity to its DTO representation
                .collect(Collectors.toList());
    }

    // retrieves products by category
    public List<ProductDTO> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // updates an existing product
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("product not found with id: " + id));

        // update existing product fields from DTO
        existingProduct.setTitle(productDTO.getTitle());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setCategory(productDTO.getCategory());
        existingProduct.setImage(productDTO.getImage());
        
        if (productDTO.getRating() != null) {
            existingProduct.setRatingRate(productDTO.getRating().getRate());
            existingProduct.setRatingCount(productDTO.getRating().getCount());
        }

        Product updatedProduct = productRepository.save(existingProduct);
        return convertToDto(updatedProduct);
    }

    // retrieves related products (same category, excluding current product)
    public List<ProductDTO> getRelatedProducts(Long productId) {
        Product currentProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("product not found with id: " + productId));
        
        return productRepository.findByCategory(currentProduct.getCategory()).stream()
                .filter(product -> !product.getId().equals(productId)) // exclude current product
                .limit(4) // limit to 4 related products
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // deletes a product by its ID
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}