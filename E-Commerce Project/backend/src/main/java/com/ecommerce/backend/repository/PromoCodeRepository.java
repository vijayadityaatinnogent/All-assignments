package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.PromoCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PromoCodeRepository extends JpaRepository<PromoCode, Long> {

    Optional<PromoCode> findByCodeAndIsActiveTrue(String code);
    
    Optional<PromoCode> findByCodeAndIsActiveTrueAndValidFromBeforeAndValidUntilAfter(
            String code, LocalDateTime now1, LocalDateTime now2);
}