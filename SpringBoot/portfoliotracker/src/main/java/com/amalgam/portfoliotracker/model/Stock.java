package com.amalgam.portfoliotracker.model;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import lombok.Data;

@Entity
@Table(name = "stocks")
@Data
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    private String name;
    private String ticker;
    private int quantity;
    
    @Column(name = "buy_price")
    private Double buyPrice;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
} 