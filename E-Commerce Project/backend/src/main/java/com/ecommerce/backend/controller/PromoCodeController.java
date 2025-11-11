package com.ecommerce.backend.controller;

import com.ecommerce.backend.service.PromoCodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/promo")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class PromoCodeController {

    private final PromoCodeService promoCodeService;

    public PromoCodeController(PromoCodeService promoCodeService) {
        this.promoCodeService = promoCodeService;
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validatePromoCode(@RequestParam String code, @RequestParam Double originalPrice) {
        try {
            Double discountAmount = promoCodeService.calculateDiscount(code, originalPrice);
            Double finalPrice = originalPrice - discountAmount;
            
            return ResponseEntity.ok(Map.of(
                "valid", true,
                "discountAmount", discountAmount,
                "finalPrice", finalPrice,
                "message", "Promo code applied successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "valid", false,
                "message", e.getMessage()
            ));
        }
    }
}