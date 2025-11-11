package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ProductDTO;
import com.ecommerce.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // marks this class as a REST controller, combining @Controller and @ResponseBody
@RequestMapping("/api/products") // base path for all endpoints in this controller
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ProductController {

    private final ProductService productService;

    // constructor injection of ProductService
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // creates a new product
    // POST http://localhost:8080/api/products
    @PostMapping // handles HTTP POST requests
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED); // returns 201 created status
    }

    // retrieves a single product by ID
    // GET http://localhost:8080/api/products/{id}
    @GetMapping("/{id}") // handles HTTP GET requests for a specific ID
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO productDTO = productService.getProductById(id);
        return ResponseEntity.ok(productDTO); // returns 200 OK status
    }

    // retrieves all products
    // GET http://localhost:8080/api/products
    @GetMapping // handles HTTP GET requests
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products); // returns 200 OK status
    }

    // retrieves products by category
    // GET http://localhost:8080/api/products/category/{categoryName}
    @GetMapping("/category/{category}") // handles HTTP GET requests to filter by category
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable String category) {
        List<ProductDTO> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products); // returns 200 OK status
    }

    // updates an existing product
    // PUT http://localhost:8080/api/products/{id}
    @PutMapping("/{id}") // handles HTTP PUT requests for a specific ID
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(updatedProduct); // returns 200 OK status
    }

    // retrieves related products by category (excluding current product)
    // GET http://localhost:8080/api/products/{id}/related
    @GetMapping("/{id}/related")
    public ResponseEntity<List<ProductDTO>> getRelatedProducts(@PathVariable Long id) {
        List<ProductDTO> relatedProducts = productService.getRelatedProducts(id);
        return ResponseEntity.ok(relatedProducts);
    }

    // deletes a product
    // DELETE http://localhost:8080/api/products/{id}
    @DeleteMapping("/{id}") // handles HTTP DELETE requests for a specific ID
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build(); // returns 204 No Content status
    }
}