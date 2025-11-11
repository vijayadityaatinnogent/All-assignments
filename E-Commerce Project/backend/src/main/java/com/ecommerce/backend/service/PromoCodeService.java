package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.PromoCode;
import com.ecommerce.backend.repository.PromoCodeRepository;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PromoCodeService {

    private final PromoCodeRepository promoCodeRepository;

    public PromoCodeService(PromoCodeRepository promoCodeRepository) {
        this.promoCodeRepository = promoCodeRepository;
    }

    public PromoCode validatePromoCode(String code) {
        LocalDateTime now = LocalDateTime.now();
        return promoCodeRepository.findByCodeAndIsActiveTrueAndValidFromBeforeAndValidUntilAfter(
                code, now, now)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired promo code: " + code));
    }

    public Double calculateDiscount(String promoCode, Double originalPrice) {
        if (promoCode == null || promoCode.trim().isEmpty()) {
            return 0.0;
        }
        
        PromoCode promo = validatePromoCode(promoCode);
        return (originalPrice * promo.getDiscountPercentage()) / 100;
    }
}